import axios from "axios";

const BASE_URL = "https://weth-usdc-v3.onrender.com";

export default axios.create({
  baseURL: BASE_URL,
});
