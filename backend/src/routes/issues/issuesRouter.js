const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  deleteAllIssues,
  getIssuesOrg,
  attendToIssue
} = require('../../controllers/issues/crudIssue.controllers');
const validateOrganization = require('../../middlewares/validateOrganizationToken'); // Assuming there's a middleware for authentication
const validateUser = require("../../middlewares/validateUserToken")


router.get("/all", getIssuesOrg)
router.put("/attend/:id", attendToIssue)
router.route('/')
  .post(validateUser, createIssue)
  .get(validateUser, getIssues)
  .delete( deleteAllIssues); // Add the delete route here


router.route('/:id')
  .get(validateOrganization, getIssueById)
  .put(validateOrganization, updateIssue)
  .delete(validateOrganization, deleteIssue);

module.exports = router;
