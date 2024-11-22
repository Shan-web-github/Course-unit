//Packages
const express = require('express');
const filesController = require('../controllers/files.controller');
const {fileUpload} = require('../config/multer.config');

const router = express.Router();

router.post("/upload", fileUpload, filesController.uploadFile);
router.get("/data/:table", filesController.getFiles);
router.get("/clashes/:level",filesController.getClashes);

module.exports = router;