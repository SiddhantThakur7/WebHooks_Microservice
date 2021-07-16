const express = require('express');

const router = express.Router();

const loginController = require('../controllers/access.controllers');

router.get('/login', loginController.getLoginPage);

// router.post('/login',);

module.exports = router;
