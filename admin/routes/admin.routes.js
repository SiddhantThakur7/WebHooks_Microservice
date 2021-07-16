const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controllers');

router.get('/', adminController.getWebHooks);

router.get('/register', adminController.getRegisterWebHooks);

router.post('/register', adminController.postRegisterWebHooks);

router.get('/update/:hid', adminController.getUpdateHook);

router.post('/update', adminController.updateWebHooks);

router.post('/delete', adminController.deleteWebHooks);


module.exports = router;
