const Router = require("express").Router();
const controller = require('./order.controller');
const validation = require('./order.validation');

Router.post('/place-order', validation.placeOrder, controller.placeOrder);
// Router.post('/cancel-order', validation.cancelOrder, controller.cancelOrder);
// Router.get('/filter-order', validation.filterOrder, controller.filterOrder);
// Router.post('/list-order-item', validation.listOrderItem, controller.listOrderItem);

module.exports = Router;