import { useState, useEffect } from "react";
import { socket } from "../api/socket";
import axios from "../api/axios";
import { convertTime, convertNumbers } from "../utils/formatData";

export default function SwapEvent() {
  const [eventHistory, setEventHistory] = useState([]);

  useEffect(() => {
    socket.on("swapEvent", (data) => {
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
      <div
        className="container overflow-x-auto overflow-y-auto"
        style={{ height: "400px" }}
      >
        {!eventHistory ? (
          <div className="container text-center mt-5">Loading Trades...</div>
        ) : (
          eventHistory.map((event) => (
            <div
              className="container border-bottom border-end border-start border-dark"
              key={event.txnhash + event.tkn0volume + event.tkn1volume}
            >
              <div className="row">
                <div className="col-3 border-end ">
                  {" "}
                  {convertTime(event.timestamp)}
                </div>
                <div className="col-1 border-end">
                  {event.tkn1volume > 0 ? (
                    <span className="text-danger">Sell</span>
                  ) : (
                    <span className="text-success">Buy</span>
                  )}
                </div>
                <div className="col-2 border-end">
                  {convertNumbers(event.tkn0volume)}
                </div>
                <div className="col-2 border-end">
                  {convertNumbers(event.tkn1volume)}
                </div>
                <div className="col-2 border-end">
                  ${convertNumbers(event.price)}
                </div>
                <div className="col-2">
                  <a
                    href={`https://etherscan.io/tx/${event.txnhash}`}
                    target="_blank"
                  >
                    {event.txnhash.substring(0, 6) +
                      "..." +
                      event.txnhash.substring(event.txnhash.length - 6)}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
