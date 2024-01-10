const joi = require("joi");
const { validation } = require("../../utils/validation");

exports.addUpdate = (req, res, next) => {
    const schema = joi.object({
        id: joi.allow(),
        store_id: joi.number().allow(),
        address: joi.object({
            first_line: joi.string().allow(),
            second_line: joi.string().allow(),
            pincode: joi.string().required(),
        }).required(),
        city_id: joi.number().required(),
        address_type: joi.string().allow()
    });

    return validation(req, res, next, schema);
};