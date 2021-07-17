const express = require('express');

const router = express.Router();

const loginController = require('../controllers/access.controllers');

router.post('/login', loginController.postLogin);

router.post('/signup', loginController.postSignup);

module.exports = router;
