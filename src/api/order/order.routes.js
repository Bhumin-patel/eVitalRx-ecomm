const Router = require("express").Router();
const controller = require('./order.controller');
const validation = require('./order.validation');

Router.post('/place-order', validation.placeOrder, controller.placeOrder);
Router.delete('/cancel-order/:id', validation.cancelOrder, controller.cancelOrder);
Router.post('/filter-order', validation.filterOrder, controller.filterOrder);
Router.get('/list-order-item/:order_id', validation.listOrderItem, controller.listOrderItem);

module.exports = Router;