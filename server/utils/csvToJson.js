const fs = require("fs");
const csv = require("csv-parser");

const csvFilePath = "./token_list.csv";
const jsonFilePath = "./token_list.json";

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    if (results.length === 0) {
      console.error(`No data found in the CSV file`);
      return;
    }

    const keys = Object.keys(results[0]);
    const jsonArray = results.map((row) => {
      const jsonObject = {};
      keys.forEach((key) => {
        jsonObject[key] = row[key];
      });
      return jsonObject;
    });

    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
  });
