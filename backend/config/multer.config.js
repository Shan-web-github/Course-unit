//Packages
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer Setup for File Storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './uploads'); // Specifies the save directory
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname); // Sets the file name
//     }
//   });

// Ensure upload directory exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Upload directory created at ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
   module.exports.fileUpload = upload.fields([
    { name: "courses", maxCount: 1 },
    { name: "mapping", maxCount: 1 },
    { name: "sem_reg", maxCount: 1 },
    { name: "offer_course_exm", maxCount: 1 }
  ]);



  