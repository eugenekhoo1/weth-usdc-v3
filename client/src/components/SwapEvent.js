import { useState, useEffect } from "react";
import { socket } from "../api/socket";
import axios from "../api/axios";
import {
  convertTime,
  convertNumbers,
  convertTimeShort,
} from "../utils/formatData";

export default function SwapEvent() {
  const [lastEvent, setLastEvent] = useState();
  const [eventHistory, setEventHistory] = useState([]);

  useEffect(() => {
    socket.on("swapEvent", (data) => {
      setLastEvent(data);
      setEventHistory((prevEvents) => {
        if (prevEvents.length > 29) {
          return [data, ...prevEvents.slice(0, 29)];
        } else {
          return [data, ...prevEvents];
        }
      });
    });

    return () => {
      socket.off("swapEvent");
    };
  }, [socket]);

  useEffect(() => {
    getTradeLogs();
  }, []);

  const getTradeLogs = async () => {
    const response = await axios.get("/data/tradedata?numtrades=30");
    setEventHistory(response.data);
  };

  return (
    <>
      <div className="container overflow-auto" style={{ height: "400px" }}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">USDC</th>
              <th scope="col">WETH</th>
              <th scope="col">Price</th>
              <th scope="col">Hash</th>
            </tr>
          </thead>
          <tbody>
            {!lastEvent ? null : (
              <tr className="table-light">
                <td> {convertTimeShort(lastEvent.timestamp)}</td>
                <td>
                  {lastEvent.tkn1volume > 0 ? (
                    <span className="text-danger">Sell</span>
                  ) : (
                    <span className="text-success">Buy</span>
                  )}
                </td>
                <td>{convertNumbers(lastEvent.tkn0volume)}</td>
                <td>{convertNumbers(lastEvent.tkn1volume)}</td>
                <td>${convertNumbers(lastEvent.price)}</td>
                <td>
                  <a
                    href={`https://etherscan.io/tx/${lastEvent.txnhash}`}
                    target="_blank"
                  >
                    {lastEvent.txnhash.substring(0, 6) +
                      "..." +
                      lastEvent.txnhash.substring(lastEvent.txnhash.length - 6)}
                  </a>
                </td>
              </tr>
            )}

            {!eventHistory ? (
              <div className="container text-center mt-5">
                Loading Trades...
              </div>
            ) : (
              eventHistory.slice(1).map((event) => (
                <tr key={event.txnhash + event.tkn0volume + event.tkn1volume}>
                  <td> {convertTimeShort(event.timestamp)}</td>
                  <td>
                    {event.tkn1volume > 0 ? (
                      <span className="text-danger">Sell</span>
                    ) : (
                      <span className="text-success">Buy</span>
                    )}
                  </td>
                  <td>{convertNumbers(event.tkn0volume)}</td>
                  <td>{convertNumbers(event.tkn1volume)}</td>
                  <td>${convertNumbers(event.price)}</td>
                  <td>
                    <a
                      href={`https://etherscan.io/tx/${event.txnhash}`}
                      target="_blank"
                    >
                      {event.txnhash.substring(0, 6) +
                        "..." +
                        event.txnhash.substring(event.txnhash.length - 6)}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
