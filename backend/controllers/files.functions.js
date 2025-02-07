// const DB = require('../models/db')
const DBpool = require("../models/db");

// exports.createTable = async (headers, tableName) => {
//   const DB = await DBpool.getConnection();
//   const column = headers
//     .map((headers) => `\`${headers}\`VARCHAR(100)`)
//     .join(",");
//   const quary = `CREATE TABLE IF NOT EXISTS\`${tableName}\`(${column})`;
//   try {
//     await DB.query(quary);
//     // await new Promise((resolve, reject) => {
//     //   DB.query(quary, (error) => {
//     //     if (error) {
//     //       console.log(error);
//     //       reject(error);
//     //     }
//     //     resolve();
//     //   });
//     // });
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
// exports.existTableDrop = async (tableName) => {
//   try {
//     const existTables = await DBpool.query(`SHOW TABLES`);
//     const existTablesName = existTables.map((row) => Object.values(row)[0]);
//     const isTableExisted = existTablesName.includes(tableName);
//     if (isTableExisted) {
//       const dropTables = `DROP TABLE ${tableName}`;
//       await DBpool.query(dropTables);
//       console.log(`successfully dropping table ${tableName}`);
//     }
//     // else {
//     //   return;
//     // }
//     // const dropTables = `DROP TABLE IF EXISTS ${tableName}`;
//     // await DBpool.query(dropTables);
//   } catch (error) {
//     console.error(`Error dropping table ${tableName}:`, error);
//   }
// };

exports.existTableDrop = async (tableName) => {
  try {
    const query = `DROP TABLE IF EXISTS \`${tableName}\``;
    await DBpool.query(query);
    console.log(`Table '${tableName}' dropped successfully (if it existed).`);
  } catch (error) {
    console.error(`Error dropping table '${tableName}':`, error.message);
    throw error;
  }
};

exports.createTable = async (headers, tableName) => {
  const connection = await DBpool.getConnection();
  try {
    const columns = headers
      .map((header) => `${header} VARCHAR(255)`)
      .join(", ");

    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;

    await connection.query(createTableSQL);
    console.log(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  } finally {
    connection.release();
  }
};

//************************************************************** */

const normalizeCOCode = (code) => {
  // Remove spaces, convert to uppercase, and remove non-alphanumeric characters like hyphens
  return code
    .replace(/\s+/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
};

const processedRows = (headers, rows) => {
  return rows
    .map((row) => {
      if (row.length !== headers.length) {
        console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
        return null;
      }

      const processedRow = row.map((cell, index) => {
        const header = headers[index];

        // Validate CO_CODE
        if (header === "CO_CODE") {
          cell = normalizeCOCode(cell);
        }

        // Clean strings
        if (typeof cell === "string") {
          return cell.trim();
        }

        return cell;
      });

      // Handle missing data by setting defaults
      return processedRow.map((cell, index) => {
        const header = headers[index];
        return cell === null || cell === undefined ? "NULL" : cell;
      });
    })
    .filter((row) => row !== null);
};

exports.insertData = async (headers, rows, tableName) => {
  const connection = await DBpool.getConnection();
  try {
    rows = rows.filter((row) =>
      Object.values(row).some((value) => value !== null && value !== "")
    );

    //********************************************** */

    // Filter out rows with no valid data
    if (rows.every((row) => Array.isArray(row))) {
      console.log("row are arrays");
      rows = processedRows(headers, rows);
    }
    //********************************************* */

    const placeholders = rows
      .map(() => `(${headers.map(() => "?").join(", ")})`)
      .join(", ");
    const insertSQL = `INSERT INTO ${tableName} (${headers.join(
      ", "
    )}) VALUES ${placeholders}`;

    //*********************************** */
    function customFlatten(rows, headers) {
      return rows.flatMap((row) => {
        return Array.isArray(row)
          ? row.flat()
          : headers.map((header) => row[header]);
      });
    }
    //********************************** */

    const flattenedRows = customFlatten(rows, headers);

    await connection.query(insertSQL, flattenedRows);
    console.log(`Data inserted into table ${tableName} successfully.`);
  } catch (error) {
    console.error(`Error inserting data into table ${tableName}:`, error);
    throw error;
  } finally {
    connection.release();
  }
};

//******************************************************************* */

// exports.createSpecialTable = async () => {
//   const connection = await DBpool.getConnection();
//   try {
//     // Create a new table from the query result
//     const createTableSQL = `CREATE TABLE new_sem_reg AS SELECT sem_reg.* FROM sem_reg INNER JOIN offer_course_exm ON sem_reg.CO_CODE = offer_course_exm.CO_CODE`;

//     // Update LEVEL and CO_CODE in the newly created table
//     const updateTableSQL = `UPDATE new_sem_reg AS nsr JOIN mapping AS m ON nsr.CO_CODE = m.OLD_CODE SET nsr.LEVEL = CASE WHEN nsr.LEVEL = 100 THEN 1000 WHEN nsr.LEVEL = 200 THEN 2000 WHEN nsr.LEVEL = 300 THEN 3000 WHEN nsr.LEVEL = 400 THEN 4000 ELSE nsr.LEVEL END, nsr.CO_CODE = m.CO_CODE`;

//     await connection.query(createTableSQL); // Create the table
//     await connection.query(updateTableSQL); // Update the table
//     console.log(`Table created and updated successfully.`);
//   } catch (error) {
//     console.error(`Error creating or updating table:`, error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

exports.checkTableExistence = async (tableName) => {
  try {
    const [rows] = await DBpool.query(`SHOW TABLES LIKE ?`, [tableName]);
    return rows.length > 0;
  } catch (error) {
    console.error(`Error creating or updating table:`, error);
    return false;
  }
};

exports.createSpecialTable = async () => {
  const connection = await DBpool.getConnection();
  try {
    // Proceed with your update logic if the table exists
    const createTableSQL = `CREATE TABLE new_sem_reg AS SELECT sem_reg.* FROM sem_reg INNER JOIN offer_course_exm ON sem_reg.CO_CODE = offer_course_exm.CO_CODE`;
    await connection.query(createTableSQL);

    const mappingTableExists = await exports.checkTableExistence("mapping");
    if (mappingTableExists) {
      const updateTableSQL1 = `UPDATE new_sem_reg JOIN mapping ON new_sem_reg.CO_CODE = mapping.OLD_CODE SET new_sem_reg.LEVEL = CASE WHEN new_sem_reg.LEVEL = 100 THEN 1000 WHEN new_sem_reg.LEVEL = 200 THEN 2000 WHEN new_sem_reg.LEVEL = 300 THEN 3000 WHEN new_sem_reg.LEVEL = 400 THEN 4000 ELSE new_sem_reg.LEVEL END, new_sem_reg.CO_CODE = mapping.CO_CODE`;
      await connection.query(updateTableSQL1);
    }

    const equivalentTableExists = await exports.checkTableExistence("equivalent");
    if (equivalentTableExists) {
      const updateTableSQL2 = `UPDATE new_sem_reg JOIN equivalent ON new_sem_reg.CO_CODE = equivalent.equivalent_CODE OR new_sem_reg.CO_CODE = equivalent.CO_CODE SET new_sem_reg.CO_CODE = equivalent.CO_CODE`;
      await connection.query(updateTableSQL2);
    }

    console.log(`Table created and updated successfully.`);
  } catch (error) {
    console.error("Error creating or updating table:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.createClashesTable1 = async () => {
  const connection = await DBpool.getConnection();
  try {
    // Proceed with your update logic if the table exists
    const createTableSQL = `CREATE TABLE clashesTable1 AS SELECT r1.CO_CODE AS course1, r2.CO_CODE AS course2, COUNT(DISTINCT r1.REG_NO) AS num_students FROM new_sem_reg r1 JOIN new_sem_reg r2 ON r1.REG_NO= r2.REG_NO AND r1.CO_CODE < r2.CO_CODE GROUP BY r1.CO_CODE, r2.CO_CODE HAVING num_students > 0`;
    await connection.query(createTableSQL);

    console.log(`Table created successfully.`);
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.createClashesTable2 = async () => {
  const connection = await DBpool.getConnection();
  try {
    // Proceed with your update logic if the table exists
    const createTableSQL = `CREATE TABLE clashesTable2 AS SELECT r1.CO_CODE AS course1, r2.CO_CODE AS course2, COUNT(DISTINCT r1.REG_NO) AS num_students FROM sem_reg r1 JOIN sem_reg r2 ON r1.REG_NO= r2.REG_NO AND r1.CO_CODE < r2.CO_CODE GROUP BY r1.CO_CODE, r2.CO_CODE HAVING num_students > 0`;
    await connection.query(createTableSQL);

    console.log(`Table created successfully.`);
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  } finally {
    connection.release();
  }
};
