// routes/organizations/authRouter.js
const express = require('express');
const signUpOrganizations = require('../../controllers/organizations/signup.controllers');
const signInOrganizations  = require('../../controllers/organizations/signin.controllers');
const currentOrganization  = require('../../controllers/organizations/current.controllers');
const ValidateOrganization = require('../../middlewares/validateOrganizationToken');

const router = express.Router();

router.post('/signup', signUpOrganizations);
router.post('/signin', signInOrganizations);
router.get("/current", ValidateOrganization, currentOrganization)

module.exports = router;
