//Packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// const filesController = require('./controllers/files.controller');
// const {fileUpload} = require('./config/multer.config');



//.env config
dotenv.config();

const app = express();

//middle ware
app.use(express.json());
app.use(cors());

try {
  const studentData = require("./routes/file.routes.js");
  app.use("/studentdata", studentData);

  // app.post("/studentdata/upload", fileUpload, filesController.uploadFile);
  // app.get("/studentdata/data/:table", filesController.getFiles);
  console.log("routing is ok");
} catch (error) {
  console.log(error);
}

//Port listening
app.listen(process.env.PORT, () => {
  console.log("Successfully connected");
});
