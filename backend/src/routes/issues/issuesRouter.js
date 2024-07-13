const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} = require('../../controllers/issues/crudIssue.controllers');
const validateOrganization = require('../../middlewares/validateOrganizationToken'); // Assuming there's a middleware for authentication

router.route('/')
  .post(validateOrganization, createIssue)
  .get(validateOrganization, getIssues);

router.route('/:id')
  .get(validateOrganization, getIssueById)
  .put(validateOrganization, updateIssue)
  .delete(validateOrganization, deleteIssue);

module.exports = router;
