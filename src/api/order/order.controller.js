const { response } = require('../../utils/response');
const orderService = require('../../models/services/order.service');

exports.placeOrder = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}
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