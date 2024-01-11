const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.placeOrder = (req, res, next) => {
    const schema = joi.object({
        address_id: joi.number().required(),
        coupon_id : joi.number().allow()
    });

    return validation(req, res, next, schema);
};

exports.cancelOrder = (req, res, next) => {
    const schema = joi.object({});

    return validation(req, res, next, schema);
};

exports.filterOrder = (req, res, next) => {
    const schema = joi.object({});

    return validation(req, res, next, schema);
};

exports.listOrderItem = (req, res, next) => {
    const schema = joi.object({});

    return validation(req, res, next, schema);
};