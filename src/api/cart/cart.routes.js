const Router = require("express").Router();
const controller = require('./cart.controller');
const validation = require('./cart.validation');

Router.post('/add', validation.add, controller.add);
Router.get('/list-cart-items', validation.listCartItems, controller.listCartItems);
Router.post('/update-cart-item', validation.updateCartItem, controller.updateCartItem);
Router.delete('/delete-cart-item/:id', validation.deleteCartItem, controller.deleteCartItem);

module.exports = Router;