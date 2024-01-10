const Router = require('express').Router();
const controller = require('./auth.controller');
const validation = require('./auth.validation');

Router.post('/signup', validation.signup,controller.signup);
Router.post('/signin', validation.signin, controller.signin);
Router.post('/forget-password', validation.forgetPassword, controller.forgetPassword);
Router.post('/reset-forget-password', validation.resetForgetPassword, controller.resetForgetPassword);


module.exports = Router;