const DB = require('../models/db')

exports.createTable = async (headers, tableName) => {
    const column = headers
      .map((headers) => `\`${headers}\`VARCHAR(100)`)
      .join(",");
    const quary = `CREATE TABLE IF NOT EXISTS\`${tableName}\`(${column})`;
    try {
      await new Promise((resolve, reject) => {
          DB.query(quary, (error) => {
            if (error) {
              console.log(error);
              reject(error);
            }
            resolve();
          });
        });
    } catch (error) {
      console.log("SQL error.");
    }
  };
  
  exports.insertData = async (headers, rows, tableName) => {
    const placeholders = headers.map(() => "?").join(",");
    const quary = `INSERT INTO ${tableName} (${headers.join(
      ","
    )}) VALUES (${placeholders})`;
  
    for (const row of rows) {
      try {
        await new Promise((resolve, reject) => {
          DB.query(quary, row, (error, result) => {
            if (error) {
              console.error("Error inserting data:", error.message);
              reject(error);
            } else {
              // console.log("Row inserted:", result);
              resolve();
            }
          });
        });
      } catch (error) {
        console.log("Stopping due to SQL error.");
        break;
      }
    }
  
    DB.end();
  };
