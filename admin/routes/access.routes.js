const express = require('express');

const router = express.Router();

const loginController = require('../controllers/access.controllers');

// ********** POST http://localhost:3000/access/login
router.post('/login', loginController.postLogin);

// ********** POST http://localhost:3000/access/signup
router.post('/signup', loginController.postSignup);


module.exports = router;
