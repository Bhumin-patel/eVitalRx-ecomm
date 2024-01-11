const { response } = require('../../utils/response');
const orderService = require('../../models/services/order.service');
const cartService = require('../../models/services/cart.service');

exports.placeOrder = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let requestData = req.body;
        requestData.user_id = id;

        const { rows } = await cartService.selectCartItems(id);

        if(rows.length === 0){
            return response(res, false, 400, 'Cart is Empty. Please add product!');
        }

        let data = await orderService.placeOrder(rows,requestData);

        if(!data.hasOwnProperty('order')){
            return response(res, true, 500, 'Something went wrong!', data);
        }
        
        return response(res, true, 200, 'Order is placed successfully!', data);
        
    } catch(error){
        console.log('---Error in order-placeOrder :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.cancelOrder = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}
    } catch(error){
        console.log('---Error in order-cancelOrder :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.filterOrder = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}
    } catch(error){
        console.log('---Error in order-filterOrder :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.listOrderItem = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}
    } catch(error){
        console.log('---Error in order-listOrderItem :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};