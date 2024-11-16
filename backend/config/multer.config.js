//Packages
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

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
   module.exports.fileUpload = upload.fields([
    { name: "courses", maxCount: 1 },
    { name: "mapping", maxCount: 1 },
    { name: "sem_reg", maxCount: 1 },
    { name: "offer_course_exm", maxCount: 1 },
  ]);



  