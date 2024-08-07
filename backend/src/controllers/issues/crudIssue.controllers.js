const asyncHandler = require('express-async-handler');
const Issue = require('../../models/IssuesModel');

const createIssue = asyncHandler(async (req, res) => {
  const { type,  location, e_type } = req.body;

  // Check for missing fields
  if (!type  || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const issue = new Issue({
    type,
    user: req.user,
    location,
    e_type
  });

  const createdIssue = await issue.save();
  res.status(201).json(createdIssue);
});

module.exports = { createIssue };


// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = asyncHandler(async (req, res) => {
  const user = req.user; // Get the authenticated user
  const issues = await Issue.find({ user: user._id }).populate('user', 'name email'); // Filter issues by user ID
  res.json(issues.reverse());
});

const getIssuesOrg = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ condition: 'unattendedTo' }).populate('user', 'name email');
  res.json(issues);
});

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('user', 'name email');

  if (issue) {
    res.json(issue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = asyncHandler(async (req, res) => {
  const { type, condition, description, location } = req.body;

  const issue = await Issue.findById(req.params.id);

  if (issue) {
    issue.type = type || issue.type;
    issue.condition = condition || issue.condition;
    issue.description = description || issue.description;
    issue.location = location || issue.location;

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    await issue.remove();
    res.json({ message: 'Issue removed' });
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

const deleteAllIssues = asyncHandler(async (req, res) => {
  await Issue.deleteMany({});
  res.json({ message: 'All issues removed' });
});

const attendToIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    if (issue.condition === 'unattendedTo') {
      issue.condition = 'attendedTo';
      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(400).json({ message: 'Issue is not in unattendedTo condition' });
    }
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});
module.exports = {
  createIssue,
  getIssues,
  getIssuesOrg,
  getIssueById,
  updateIssue,
  deleteIssue,
  deleteAllIssues,
  attendToIssue
};
