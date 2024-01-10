const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.add = (req, res, next) => {
    const schema = joi.object({
        quantity: joi.number().required(),
        product_id: joi.number().required(),
        store_id: joi.number().required()
    });

    return validation(req, res, next, schema);
};

exports.listCartItems = (req, res, next) => {
    const schema = joi.object({});

    return validation(req, res, next, schema);
};

exports.updateCartItem = (req, res, next) => {
    const schema = joi.object({
        id: joi.number().required(),
        quantity: joi.number().allow()
    });

    return validation(req, res, next, schema);
};

exports.deleteCartItem = (req, res, next) => {
    const schema = joi.object({});

    return validation(req, res, next, schema);
};