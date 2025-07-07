/**
 * Authentication Routes
 */

const express = require('express');
// Remove express-validator body as Joi will handle it
const authController = require('../controllers/auth');
const { authenticate } = require('../middlewares/auth');
const { createLimiter } = require('../middlewares/rateLimiter');
const validateWithJoi = require('../middlewares/validateJoi'); // Import new Joi middleware
const authValidationSchemas = require('../validations/auth.validation'); // Import Joi schemas
const passport = require('../config/passport');
const { logger } = require('../utils/logger');

const router = express.Router();

// Registration route with Joi validation
router.post(
  '/register',
  createLimiter('register'),
  validateWithJoi(authValidationSchemas.register),
  authController.register
);

// Login route with Joi validation
router.post(
  '/login',
  createLimiter('login'),
  validateWithJoi(authValidationSchemas.login),
  authController.login
);

// Email verification route - No body validation needed, token is in params
router.get('/verify/:token', authController.verifyEmail);

// Resend verification email - Joi validation for email
router.post(
  '/resend-verification',
  createLimiter('emailVerification'),
  validateWithJoi(authValidationSchemas.forgotPassword), // forgotPassword schema just checks for email
  authController.resendVerificationEmail
);

// Forgot password - Joi validation for email
router.post(
  '/forgot-password',
  createLimiter('forgotPassword'),
  validateWithJoi(authValidationSchemas.forgotPassword),
  authController.forgotPassword
);

// Reset password - Joi validation for new password
// Token is in params, password in body
router.post(
  '/reset-password/:token', // Token will be handled by controller
  validateWithJoi(authValidationSchemas.resetPassword), // Validates req.body for password fields
  authController.resetPassword
);

// Logout route - No body validation needed
router.post('/logout', authController.logout);

// Refresh token - Joi validation for refreshToken
router.post(
  '/refresh-token',
  validateWithJoi(authValidationSchemas.refreshToken),
  authController.refreshToken
);

// Change password (protected route) - Joi validation
router.post(
  '/change-password',
  authenticate,
  validateWithJoi(authValidationSchemas.changePassword),
  authController.changePassword
);

// Get current user profile
router.get('/me', authenticate, authController.getMe);

// Verify authentication token and get user data
router.get('/verify', authenticate, authController.verifyAuth);

// Google OAuth routes - only if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  }));

  router.get('/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login` 
    }),
    authController.oauthCallback
  );
} else {
  // Add a route to inform users that Google auth is not configured
  router.get('/google', (req, res) => {
    logger.warn('Google OAuth route accessed but not configured');
    return res.status(501).json({
      success: false,
      message: 'Google authentication is not configured on the server'
    });
  });

  router.get('/google/callback', (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_not_configured`);
  });
}

// Facebook OAuth routes - only if credentials are configured
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  router.get('/facebook', passport.authenticate('facebook', { 
    scope: ['email'] 
  }));

  router.get('/facebook/callback', 
    passport.authenticate('facebook', { 
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
    }),
    authController.oauthCallback
  );
} else {
  // Add a route to inform users that Facebook auth is not configured
  router.get('/facebook', (req, res) => {
    logger.warn('Facebook OAuth route accessed but not configured');
    return res.status(501).json({
      success: false,
      message: 'Facebook authentication is not configured on the server'
    });
  });

  router.get('/facebook/callback', (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_not_configured`);
  });
}

// LinkedIn OAuth routes - only if credentials are configured
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  router.get('/linkedin', passport.authenticate('linkedin', { 
    scope: ['r_emailaddress', 'r_liteprofile'] 
  }));

  router.get('/linkedin/callback', 
    passport.authenticate('linkedin', { 
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
    }),
    authController.oauthCallback
  );
} else {
  // Add a route to inform users that LinkedIn auth is not configured
  router.get('/linkedin', (req, res) => {
    logger.warn('LinkedIn OAuth route accessed but not configured');
    return res.status(501).json({
      success: false,
      message: 'LinkedIn authentication is not configured on the server'
    });
  });

  router.get('/linkedin/callback', (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_not_configured`);
  });
}

// MFA routes (protected by authentication)
router.post('/mfa/setup', authenticate, authController.setupTwoFactor);
router.post('/mfa/verify', authenticate, authController.verifyTwoFactor);
router.post('/mfa/disable', authenticate, authController.disableTwoFactor);

// Session management routes
router.get('/sessions', authenticate, authController.getSessions);
router.delete('/sessions', authenticate, authController.endAllSessions);
router.delete('/sessions/:sessionId', authenticate, authController.endSession);

// User account management routes
router.post('/account/deactivate', authenticate, authController.deactivateAccount);
router.post('/account/reactivate', authController.reactivateAccount);

// Health check route - useful for monitoring
router.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Auth service is up and running'
  });
});

module.exports = router; 