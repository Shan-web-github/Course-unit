//Packages
const fs = require("fs");
const xlsx = require("node-xlsx");
const DB = require("../models/db");
const { createTable, insertData } = require("./functions");

exports.uploadFile = (req, res) => {
  const coursesFile = req.files["courses"] ? req.files["courses"][0] : null;
  const mappingFile = req.files["mapping"] ? req.files["mapping"][0] : null;
  const sem_regFile = req.files["sem_reg"] ? req.files["sem_reg"][0] : null;
  const offer_course_exmFile = req.files["offer_course_exm"]
    ? req.files["offer_course_exm"][0]
    : null;

  const fileArray = [
    coursesFile,
    mappingFile,
    sem_regFile,
    offer_course_exmFile,
  ];

  // Loop through each file
  try {
    fileArray.forEach((file) => {
      if (file) {
        const filePath = file.path;
        const tableName = file.fieldname;

        // Using Node-xlsx
        // Read and parse the Excel file
        const workbook = xlsx.parse(fs.readFileSync(filePath));

        // Assuming data is in the first sheet and that the first row contains headers
        const sheet = workbook[0].data;

        // Get headers and rows
        const headers = sheet[0];
        const rows = sheet.slice(1);

        console.log(`Processing file for table: ${tableName}`);
        console.log(`Headers: ${headers}`);
        console.log(`Rows: ${rows.length}`);

        // Create table and insert data
        createTable(headers, tableName);
        insertData(headers, rows, tableName);
      }
    });

    return res
      .status(201)
      .send("Tables created and data inserted successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
    return res.status(501).send(error.message);
  }
};

exports.getFiles = (req, res) => {
  const tableName = req.params.table;
  DB.query(`SELECT * FROM ${tableName}`, (error, result, fields) => {
    if (error) {
      res.status(501).send(error);
      return;
    }

    const columnNames = fields.map((field) => field.name);
    // console.log(columnNames);

    return res.json({
      columns: columnNames,
      data: result,
    });
  });
};
