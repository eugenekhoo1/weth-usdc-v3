import { useState, useEffect } from "react";
import { socket } from "../api/socket";
import axios from "../api/axios";
import Chart from "react-apexcharts";

export default function CandlestickChart() {
  const [intervalData, setIntervalData] = useState([]);
  const [timeInterval, setTimeInterval] = useState("5,m");

  useEffect(() => {
    socket.on("updateChart", (data) => {
      updateIntervalData();
    });
    return () => {
      socket.off("updateChart");
    };
  }, [socket]);

  useEffect(() => {
    updateIntervalData();
  }, [timeInterval]);

  const updateIntervalData = async () => {
    const num = timeInterval.split(",")[0];
    const interval = timeInterval.split(",")[1];
    const response = await axios.get(
      `/data/chartdata?num=${num}?interval=${interval}`
    );
    setIntervalData(
      response.data.map((item) => {
        return {
          x: item.date,
          y: [item.open, item.low, item.high, item.low, item.close],
        };
      })
    );
  };

  const chart = {
    options: {
      chart: {
        type: "candlestick",
        height: 400,
      },
      title: {
        text: "WETH/USDC UNIv3",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  return (
    <>
      {console.log(timeInterval)}
      {intervalData.length === 0 ? null : (
        <div className="container">
          <div className="row mt-4 mb-4">
            <div className="col-3">
              <span
                style={{
                  padding: "10px",
                  border: "solid",
                  backgroundColor: timeInterval === "5,m" ? "lightgrey" : null,
                }}
                onClick={() => setTimeInterval("5,m")}
              >
                5m
              </span>
              <span
                style={{
                  padding: "10px",
                  border: "solid",
                  backgroundColor: timeInterval === "15,m" ? "lightgrey" : null,
                }}
                onClick={() => setTimeInterval("15,m")}
              >
                15m
              </span>
              <span
                style={{
                  padding: "10px",
                  border: "solid",
                  backgroundColor: timeInterval === "30,m" ? "lightgrey" : null,
                }}
                onClick={() => setTimeInterval("30,m")}
              >
                30m
              </span>
              <span
                style={{
                  padding: "10px",
                  border: "solid",
                  backgroundColor: timeInterval === "60,m" ? "lightgrey" : null,
                }}
                onClick={() => setTimeInterval("60,m")}
              >
                1h
              </span>
              <span
                style={{
                  padding: "10px",
                  border: "solid",
                  backgroundColor:
                    timeInterval === "240,m" ? "lightgrey" : null,
                }}
                onClick={() => setTimeInterval("240,m")}
              >
                4h
              </span>
            </div>
          </div>
          <Chart
            options={chart.options}
            series={[{ data: intervalData }]}
            type="candlestick"
            width="100%"
            height={320}
          />
        </div>
      )}
    </>
  );
}
