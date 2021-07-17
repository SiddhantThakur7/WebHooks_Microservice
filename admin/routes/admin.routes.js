const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controllers');

// isAuth middleware will be passed to ensure access is authorized at each admin route
const isAuth = require('../isAuth.util');

// ********** GET http://localhost:3000/admin/
router.get('/', isAuth, adminController.getWebHooks);

// ********** GET http://localhost:3000/admin/register
router.get('/register', isAuth, adminController.getRegisterWebHooks);

// ********** POST http://localhost:3000/admin/register
router.post('/register', isAuth, isAuth, adminController.postRegisterWebHooks);

// ********** GET http://localhost:3000/admin/update/:{hook_id}
router.get('/update/:hid', isAuth, adminController.getUpdateHook);

// ********** POST http://localhost:3000/admin/update
router.post('/update', isAuth, adminController.updateWebHooks);

// ********** POST http://localhost:3000/admin/delete
router.post('/delete', isAuth, adminController.deleteWebHooks);


module.exports = router;
