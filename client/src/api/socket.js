import io from "socket.io-client";

export const socket = io.connect("https://weth-usdc-v3.onrender.com");
