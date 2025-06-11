const express= require("express");
const router = express.Router();

const authController = require('../controllers/app.controller')
const authorization = require('../middlewares/auth.middleware')

router.post('/signup' , authController.register);
router.post('/login' , authController.login);
router.get('/dashboard',authorization,authController.dashboard);

module.exports = router;
