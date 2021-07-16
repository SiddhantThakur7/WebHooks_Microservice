const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controllers');

router.get('/', adminController.getWebHooks);

// router.get('/register', loginController.postSignup);

// router.post('/register', loginController.postSignup);

// router.post('/update', loginController.postSignup);

// router.post('/delete', loginController.postSignup);


module.exports = router;
