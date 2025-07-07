/**
 * Joi Validation Middleware
 * Handles validation of request data using Joi schemas
 */
const { AppError } = require('../utils/errorTypes');
const logger = require('../utils/logger');

/**
 * Create a middleware function that validates request data against a Joi schema.
 * @param {Joi.Schema} schema - The Joi schema to validate against.
 * @param {string} [dataSource='body'] - The source of data in the request object ('body', 'query', 'params').
 * @returns {Function} Express middleware function.
 */
const validateWithJoi = (schema, dataSource = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[dataSource];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown keys from the validated data
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      logger.warn(`Joi Validation error (${dataSource}): ${errorMessages}`);
      // It's common to pass the first error message or a generic one for AppError
      // For more detailed client-side error handling, you might structure these errors differently
      return next(new AppError(error.details[0].message, 400));
    }

    // Attach validated and potentially transformed (e.g. default values) data back to the request object
    req[dataSource] = value;
    next();
  };
};

module.exports = validateWithJoi;
