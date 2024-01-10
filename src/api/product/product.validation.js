const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.filter = (req, res, next) => {
    const schema = joi.object({

        id: joi.number().allow(),
        name: joi.string().max(100).allow(),
        product_category: joi.number().allow(),
        mrp: joi.number().allow(),
        store_id: joi.number().allow()
    });

    return validation(req, res, next, schema);
};