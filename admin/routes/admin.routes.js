const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controllers');

const isAuth = require('../isAuth.util');

router.get('/', isAuth, adminController.getWebHooks);

router.get('/register', isAuth, adminController.getRegisterWebHooks);

router.post('/register', isAuth, isAuth, adminController.postRegisterWebHooks);

router.get('/update/:hid', isAuth, adminController.getUpdateHook);

router.post('/update', isAuth, adminController.updateWebHooks);

router.post('/delete', isAuth, adminController.deleteWebHooks);


module.exports = router;
