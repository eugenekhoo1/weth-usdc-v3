const tokenList = require("../constants/tokenList.json");

function getTokenName(address) {
  const tokenAddress = address.toLowerCase();
  for (const item of tokenList) {
    if (item.platforms.toLowerCase() === tokenAddress) {
      return item.symbol;
    }
  }
  return null;
}

module.exports = getTokenName;
