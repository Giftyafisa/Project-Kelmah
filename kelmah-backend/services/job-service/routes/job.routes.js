/**
 * Job Routes
 */

const express = require('express');
const { validate } = require('../middlewares/validator');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');
const jobController = require('../controllers/job.controller');
const jobValidation = require('../validations/job.validation');

const router = express.Router();

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Protected routes
router.use(authenticateUser);

// Hirer only routes
router.post(
  '/',
  authorizeRoles('hirer'),
  validate(jobValidation.createJob),
  jobController.createJob
);

router.get('/my-jobs', authorizeRoles('hirer'), jobController.getMyJobs);

router.put(
  '/:id',
  authorizeRoles('hirer'),
  validate(jobValidation.updateJob),
  jobController.updateJob
);

router.delete('/:id', authorizeRoles('hirer'), jobController.deleteJob);

router.patch(
  '/:id/status',
  authorizeRoles('hirer'),
  validate(jobValidation.changeJobStatus),
  jobController.changeJobStatus
);

module.exports = router; 