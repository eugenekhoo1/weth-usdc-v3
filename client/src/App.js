import SwapEvent from "./components/SwapEvent";
import TableHeader from "./components/TableHeader";
import CandlestickChart from "./components/CandlestickChart";

function App() {
  return (
    <>
      <div className="mt-5"></div>
      <CandlestickChart />
      <TableHeader />
      <SwapEvent />
    </>
  );
}

export default App;
