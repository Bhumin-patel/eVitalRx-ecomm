const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.verifyAdmin = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
  });

  return validation(req, res, next, schema);
};

exports.resetPassword = (req, res, next) => {
  const schema = joi.object({
    old_password: joi.string().alphanum().min(6).required(),
    new_password: joi.string().alphanum().min(6).required(),
  });

  return validation(req, res, next, schema);
};
