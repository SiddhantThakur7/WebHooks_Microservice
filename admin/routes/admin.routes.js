const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controllers');

router.get('/', adminController.getWebHooks);

router.get('/register', adminController.getRegisterWebHooks);

// router.post('/register', loginController.postSignup);

router.get('/update/:hid', adminController.getUpdateHook);

router.post('/update', adminController.updateWebHooks);

// router.post('/delete', loginController.postSignup);


module.exports = router;
