const express = require('express');

const router = express.Router();

//isAuth middleware to authorize access at the ip route.
const isAuth = require('../isAuth.util');

const triggerController = require('../controllers/ip.controllers');

// ********** get http://localhost:3000/ip/
router.get('/', isAuth, triggerController.triggerWebHooks);

module.exports = router;
