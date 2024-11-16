//Packages
const dotenv = require("dotenv");
const mysql = require("mysql2");


//.env config
dotenv.config();


//DB connection

const DB = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });
  
  DB.connect((err) => {
    if (err) {
      console.log(err);
    }
    console.log("Successfully DB Connected");
  });

  module.exports = DB;