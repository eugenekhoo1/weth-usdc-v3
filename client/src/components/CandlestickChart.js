import { useState, useEffect } from "react";
import { socket } from "../api/socket";
import axios from "../api/axios";
import Chart from "react-apexcharts";

export default function CandlestickChart() {
  const [intervalData, setIntervalData] = useState([]);

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
  }, []);

  const updateIntervalData = async () => {
    const response = await axios.get("/data/chartdata?num=1?interval=m");
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
        height: 350,
      },
      title: {
        text: "CandleStick Chart",
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
      {console.log([{ data: intervalData }])}
      {intervalData.length === 0 ? null : (
        <div className="container">
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
