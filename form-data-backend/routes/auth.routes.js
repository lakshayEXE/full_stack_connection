const express= require("express");
const router = express.Router();

const authController = require('../controllers/app.controller')
const authorization = require('../middlewares/auth.middleware')

router.post('/signup' , authController.register);
router.post('/login' , authController.login);
router.get('/dashboard',authorization,authController.dashboard);
//console.log("updateProfile:", authController.updateProfile);  // should print: [Function: updateProfile]

router.put('/update-profile' , authorization , authController.updateProfile)
module.exports = router;
