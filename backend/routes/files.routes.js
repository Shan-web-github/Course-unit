//Packages
const express = require('express');
const filesController = require('../controllers/files.controller');
const {fileUpload} = require('../config/multer.config');

const router = express.Router();

router.post("/upload", fileUpload, filesController.uploadFile);
router.get("/requiredtablesexist",filesController.requiredTablesExist);
router.get("/newsemreg",filesController.createNewSemReg);
router.get("/data/:table", filesController.getFiles);
router.get("/checktable/:tableName",filesController.isTablesExist);

router.get("/generate-timetable",filesController.setupExam);
router.post("/save-schedule/:table_index",filesController.saveTimetable);
router.get("/view-schedule/:table_index",filesController.viewTimetable);

router.get("/clashes/:level",filesController.getClashes);
router.post("/uploadClashes/:level",filesController.uploadClashes);
router.get("/createClashes",filesController.createClashes);
router.get("/clashesForCheck",filesController.clashesForCheck);

router.get("/courses/:coursesAttribute",filesController.getCourses);
router.get("/allcourses",filesController.getAllCourses);
router.get("/notclashes1/:coursesList",filesController.getNotClashes1);
router.get("/notclashes2/:coursesList",filesController.getNotClashes2);
router.get("/checkclashes/:coursesList",filesController.checkClashes);

module.exports = router;