const Router = require("express").Router();
const controller = require('./city.controller');
const validation = require('./city.validation');

Router.post('/add-update', validation.addUpdate, controller.addUpdate);
Router.post('/filter', validation.filter, controller.filter);
Router.delete('/delete/:id', validation.delete, controller.delete);

module.exports = Router;