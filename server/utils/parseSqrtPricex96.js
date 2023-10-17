function getPrice(price, decimal0, decimal1) {
  const token0Price =
    (price.toString() / 2 ** 96) ** 2 /
    (10 ** decimal1 / 10 ** decimal0).toFixed(decimal1);
  const token1Price = (1 / token0Price).toFixed(decimal0);

  return { token0Price, token1Price };
}

module.exports = getPrice;
