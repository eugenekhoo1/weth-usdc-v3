const express = require("express");
const { ethers } = require("ethers");
const ABI = require("./constants/uniswapv3abi.json");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const corsOptions = require("./config/corsOption");
const credentials = require("./middleware/credentials");
const getTokenName = require("./utils/getTokenName");
const { query } = require("./config/db");
const dataRoutes = require("./routes/dataRoutes");

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const contractAddress = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"; // WETH-USDC V3
const contract = new ethers.Contract(contractAddress, ABI, provider);

async function getV3Events() {
  const token0 = await contract.token0();
  const token1 = await contract.token1();
  const token0Symbol = getTokenName(token0);
  const token1Symbol = getTokenName(token1);
  const token0decimals = 6;
  const token1decimals = 18;

  contract.on(
    "Swap",
    async (
      sender,
      recipient,
      amount0,
      amount1,
      sqrtPriceX96,
      liquidity,
      tick,
      event
    ) => {
      console.log(`swap event detected!`);

      const blockInfo = await provider.getBlock(event.log.blockNumber);

      const eventData = {
        sender: sender,
        recipient: recipient,
        tkn0symbol: token0Symbol,
        tkn1symbol: token1Symbol,
        tkn0volume: parseInt(amount0.toString()) / 10 ** token0decimals,
        tkn1volume: parseInt(amount1.toString()) / 10 ** token1decimals,
        price:
          10 ** (token1decimals - token0decimals) /
          (sqrtPriceX96.toString() ** 2 / 2 ** 192),
        timestamp: blockInfo.timestamp * 1000,
        txnhash: event.log.transactionHash.toString(),
        block: blockInfo.number,
      };

      const chartData = {
        datetime: blockInfo.timestamp * 1000,
        price:
          10 ** (token1decimals - token0decimals) /
          (sqrtPriceX96.toString() ** 2 / 2 ** 192),
        token0Amount: parseInt(amount0.toString()) / 10 ** token0decimals,
        token1Amount: parseInt(amount1.toString()) / 10 ** token1decimals,
        txnHash: event.log.transactionHash.toString(),
      };

      try {
        io.emit("swapEvent", eventData);
        const response = await query(
          `INSERT INTO logs (sender, recipient, tkn0symbol, tkn1symbol, tkn0volume, tkn1volume, price, timestamp, txnhash, block) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            eventData.sender,
            eventData.recipient,
            eventData.tkn0symbol,
            eventData.tkn1symbol,
            eventData.tkn0volume,
            eventData.tkn1volume,
            eventData.price.toFixed(2),
            eventData.timestamp,
            eventData.txnhash,
            eventData.block,
          ]
        );
        io.emit("updateChart", chartData);
      } catch (err) {
        console.log(err);
      }
      console.log(`Sent to client!`);
    }
  );
}

app = express();
app.use(credentials);
app.use(cors(corsOptions));

app.use("/data", dataRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

getV3Events();

server.listen(5000, () => {
  console.log("listening on *:5000");
});
