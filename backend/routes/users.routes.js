const express = require('express');
const userController = require('../controllers/users.controller');
const auth = require('../authentication/auth');
const router = express.Router();

router.post("/signup",userController.userSignup);
router.post("/login",userController.userLogin);

router.get("/access",auth.pageAuth);


module.exports = router;