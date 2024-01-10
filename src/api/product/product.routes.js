const Router = require("express").Router();
const controller = require('./product.controller');
const validation = require('./product.validation');

Router.post('/filter', validation.filter, controller.filter);
module.exports = Router;