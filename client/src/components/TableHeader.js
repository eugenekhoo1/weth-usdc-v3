export default function TableHeader() {
  return (
    <div className="container border-bottom border-dark">
      <div className="row">
        <div className="col-3">Date</div>
        <div className="col-1">Type</div>
        <div className="col-2">USDC</div>
        <div className="col-2">WETH</div>
        <div className="col-2">Price</div>
        <div className="col-2">Hash</div>
      </div>
    </div>
  );
}
