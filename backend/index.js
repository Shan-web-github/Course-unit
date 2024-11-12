//Packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const fs = require("fs");
// const csv = require("csv-parser");
const path = require("path");
const xlsx = require("node-xlsx");
const multer = require("multer");

dotenv.config();


const app = express();

//middle ware
app.use(express.json());
app.use(cors());

//DB connection

const DB = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

DB.connect((err)=>{
    if (err) {
        console.log(err);
    }
    console.log("Successfully DB Connected");
}
);


// Multer Setup for File Storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './uploads'); // Specifies the save directory
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname); // Sets the file name
//     }
//   });
  


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
  const fileUpload = upload.fields([{name:'courses',maxCount:1},{name:'mapping',maxCount:1},{name:'sem_reg',maxCount:1},{name:'offer_course_exm',maxCount:1}]);

app.post('/upload',fileUpload,(req,res)=>{
    const coursesFile = req.files['courses'] ? req.files['courses'][0] : null;
    const mappingFile = req.files['mapping'] ? req.files['mapping'][0] : null;
    const sem_regFile = req.files['sem_reg'] ? req.files['sem_reg'][0] : null;
    const offer_course_exmFile = req.files['offer_course_exm'] ? req.files['offer_course_exm'][0] : null;

    // console.log(sem_regFile);
    const filePath = coursesFile.path;
    let tableName = coursesFile.fieldname;

//Using Node-xlsx 

// Read and parse the Excel file
const workbook = xlsx.parse(fs.readFileSync(filePath));

// Assuming data is in the first sheet and that the first row contains headers
const sheet = workbook[0].data;

//column name
const headers = sheet[0];
//Data
const rows = sheet.slice(1);

createTable(headers, tableName);
insertData(headers,rows,tableName);
    
});


app.get('/data/:table', (req, res) => {
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
            data: result
        });
    });
});

const createTable = async(headers,tableName) =>{
    const column = headers.map(headers=>`\`${headers}\`VARCHAR(100)`).join(',');
    const quary = `CREATE TABLE IF NOT EXISTS\`${tableName}\`(${column})`;
    return new Promise((resolve,reject)=>{
        DB.query(quary,(error)=>{
            if (error) {
                console.log(error);
                reject();
            }
            resolve();
        });
    });
}

const insertData = async(headers,rows,tableName)=>{
    const placeholders = headers.map(()=>'?').join(',');
    const quary = `INSERT INTO ${tableName} (${headers.join(',')}) VALUES (${placeholders})`;

    rows.forEach((row)=>{
        DB.query(quary, row, (error,result)=>{
            if (error) {
                 console.error('Error inserting data:', error.message);
                } 
                // console.log(result);
        });
    });

    DB.end();
}



// //Path
// const filePath = path.join(__dirname,'assets','SampleData_CourseFile.xlsx')

// //Using Node-xlsx 

// // Read and parse the Excel file
// const workbook = xlsx.parse(fs.readFileSync(filePath));

// // Assuming data is in the first sheet and that the first row contains headers
// const sheet = workbook[0].data;

// //column name
// const headers = sheet[0];
// //Data
// const rows = sheet.slice(1);

// createTable(headers);
// insertData(headers);


//Port listening
app.listen(process.env.PORT,()=>{
    console.log("Successfully connected");
});

