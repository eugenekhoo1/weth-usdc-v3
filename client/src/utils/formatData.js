const convertTime = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const convertNumbers = (number) => {
  return Math.abs(number).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const convertTimeShort = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  const day = date.getDate().toString();
  const month = date.toLocaleString("default", { month: "short" });

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${month} ${day} ${hours}:${minutes}:${seconds}`;
};

export { convertTime, convertNumbers, convertTimeShort };
