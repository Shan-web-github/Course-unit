// const DB = require('../models/db')
const DBpool = require("../models/db");

// exports.createTable = async (headers, tableName) => {
//   const DB = await DBpool.getConnection();
//   const column = headers
//     .map((headers) => `\`${headers}\`VARCHAR(100)`)
//     .join(",");
//   const quary = `CREATE TABLE IF NOT EXISTS\`${tableName}\`(${column})`;
//   try {
//     await new Promise((resolve, reject) => {
//       DB.query(quary, (error) => {
//         if (error) {
//           console.log(error);
//           reject(error);
//         }
//         resolve();
//       });
//     });
//   } catch (error) {
//     console.log("SQL error.");
//   } finally {
//     DB.release();
//   }
// };

// exports.insertData = async (headers, rows, tableName) => {
//   const DB = await DBpool.getConnection();
//   const placeholders = headers.map(() => "?").join(",");
//   const quary = `INSERT INTO ${tableName} (${headers.join(
//     ","
//   )}) VALUES (${placeholders})`;

//   for (const row of rows) {
//     try {
//       await new Promise((resolve, reject) => {
//         DB.query(quary, row, (error, result) => {
//           if (error) {
//             console.error("Error inserting data:", error.message);
//             reject(error);
//           } else {
//             // console.log("Row inserted:", result);
//             resolve();
//           }
//         });
//       });
//     } catch (error) {
//       console.log("Stopping due to SQL error.");
//       break;
//     }
//   }

//   DB.release();
// };

exports.createTable = async (headers, tableName) => {
  const connection = await DBpool.getConnection();
  try {
    const columns = headers.map(header => `${header} VARCHAR(255)`).join(', ');
    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;

    await connection.query(createTableSQL);
    console.log(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  } finally {
    connection.release(); // Release connection back to the pool
  }
};

exports.insertData = async (headers, rows, tableName) => {
  const connection = await DBpool.getConnection();
  try {
    const placeholders = rows.map(() => `(${headers.map(() => '?').join(', ')})`).join(', ');
    const insertSQL = `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES ${placeholders}`;
    const flattenedRows = rows.flat();

    await connection.query(insertSQL, flattenedRows);
    console.log(`Data inserted into table ${tableName} successfully.`);
  } catch (error) {
    console.error(`Error inserting data into table ${tableName}:`, error);
    throw error;
  } finally {
    connection.release(); // Release connection back to the pool
  }
};
