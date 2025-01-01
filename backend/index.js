//Packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const ipAddress = '10.40.48.115';

// const filesController = require('./controllers/files.controller');
// const {fileUpload} = require('./config/multer.config');



//.env config
dotenv.config();

const app = express();

//middle ware
app.use(express.json());

app.use(cors({
  // origin: `http://${ipAddress}:3000`,
  // methods: ['GET', 'POST'],
  // credentials: true,
}));


try {
  const studentData = require("./routes/files.routes.js");
  app.use("/studentdata", studentData);

  const usersdata = require("./routes/users.routes.js");
  app.use("/usersdata",usersdata);

  // app.post("/studentdata/upload", fileUpload, filesController.uploadFile);
  // app.get("/studentdata/data/:table", filesController.getFiles);
  console.log("routing is ok");
} catch (error) {
  console.log(error);
}

//Port listening
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log("Successfully connected");
});
