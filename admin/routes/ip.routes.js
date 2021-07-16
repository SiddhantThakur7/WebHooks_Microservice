const express = require('express');

const router = express.Router();

const triggerController = require('../controllers/ip.controllers');

router.get('/', triggerController.triggerWebHooks);

module.exports = router;
