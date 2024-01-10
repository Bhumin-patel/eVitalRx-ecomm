const Router = require("express").Router();
const controller = require('./address.controller');
const validation = require('./address.validation');

Router.post('/add-update', validation.addUpdate, controller.addUpdate);
// Router.post('/filter', controller.filter);
// Router.delete('/delete/:id', controller.delete);

module.exports = Router;