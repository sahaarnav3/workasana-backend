const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const verifyJWT = require('../middlewares/verifyJWT');


// console.log("User Router Loaded.");

//Route to sign-up(create) the user.
router.post("/signup", userController.signUpUser);

//Route to login user.
router.post("/login", userController.login);

//Route to fetch current logged in user details.
router.get("/me", verifyJWT, userController.currentUser);


module.exports = router;