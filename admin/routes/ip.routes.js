const express = require('express');

const router = express.Router();

const isAuth = require('../isAuth.util');

const triggerController = require('../controllers/ip.controllers');

router.get('/', isAuth, triggerController.triggerWebHooks);

module.exports = router;
