const Joi = require('joi');

exports.markRead = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  })
}; 