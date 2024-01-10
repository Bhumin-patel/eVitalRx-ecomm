const Router = require('express').Router();
const controller = require('./user.controller');
const validation = require('./user.validation');

Router.post('/verify-admin', validation.verifyAdmin, controller.verifyAdmin);
Router.post('/reset-password', validation.resetPassword, controller.resetPassword);

module.exports = Router;