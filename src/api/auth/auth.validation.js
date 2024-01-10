const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.signup = (req, res, next) => {
  const schema = joi.object({
    first_name: joi.string().min(2).max(30).required(),

    last_name: joi.string().min(2).max(30).allow(),

    email: joi.string().email().required(),

    password: joi.string().alphanum().min(6).required(),

    phone: joi
      .string()
      .allow(),

    user_role: joi.string().valid("super-admin", "admin", "user").required(),

    user_profile_picture: joi.string().allow(),
  });

  return validation(req, res, next, schema);
};

exports.signin = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),

    password: joi.string().alphanum().min(6).required(),
  });

  return validation(req, res, next, schema);
};

exports.forgetPassword = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
  });

  return validation(req, res, next, schema);
};

exports.resetForgetPassword = (req, res, next) => {
  const schema = joi.object({
    otp: joi.number().required(),
    password: joi.string().alphanum().min(6).required(),
    conform_password: joi.string().alphanum().min(6).required(),
  });

  return validation(req, res, next, schema);
};
