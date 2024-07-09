// routes/userRouter.js
const express = require('express');
const signUpUser = require('../../controllers/user/signup.controllers'); 
const signInUser = require('../../controllers/user/signin.controllers'); 
const currentUser  = require('../../controllers/user/current.controllers');
const ValidateUser = require('../../middlewares/validateUserToken');
const userAuthRouter = express.Router();

userAuthRouter.post('/signup', signUpUser);
userAuthRouter.post('/signin', signInUser);
userAuthRouter.get("/current", ValidateUser, currentUser)

module.exports = userAuthRouter;