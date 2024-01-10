const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.addUpdate = (req, res, next) => {
    const schema = joi.object({
        id: joi.number().allow(),
        name: joi.string().max(30).required(),
        state_id: joi.number().required()
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