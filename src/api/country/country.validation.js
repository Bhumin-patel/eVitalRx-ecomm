const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.addUpdate = (req, res, next) => {
    const schema = joi.object({
        id: joi.number().allow(),
        name: joi.string().max(30).required(),
        country_code: joi.string().max(30).required(),
        country_flag_image: joi.string().allow(),
        currency: joi.string().max(30).required(),
    });

    return validation(req, res, next, schema);
};

exports.filter = (req, res, next) => {
    const schema = joi.object({
        id: joi.number().allow()
    });

    return validation(req, res, next, schema);
};

exports.delete = (req, res, next) => {
    const schema = joi.object({});

    return validation(req, res, next, schema);
};