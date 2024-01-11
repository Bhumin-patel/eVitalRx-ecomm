const { response } = require('../../utils/response');
const cartService = require('../../models/services/cart.service');

exports.add = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let requestData = req.body;

        requestData.user_id = id;

        let { rows: check } = await cartService.selectItemFromCart(requestData); // pass required params only

        if(check.length === 1){
            return response(res, false, 400, 'Product is already in the cart!');
        }

        let { rows } = await cartService.add(requestData); //

        return response(res, true, 200, 'Product is added in the cart!', rows[0]);        
    } catch(error){
        console.log('---Error in cart-add :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
}

exports.listCartItems = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let { rows } = await cartService.selectCartItems(id);

        return response(res, true, 200, 'Cart item list', rows);        
    } catch(error){
        console.log('---Error in cart-listCartItems :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
}

exports.updateCartItem = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let requestData = req.body;

        let { rows:check } = await cartService.selectCartByCartId(requestData.id,id);

        if(check.length === 0){
            return response(res, false, 400, 'Cart item does not exist!');
        }

        let { rows } = await cartService.updateCartItem(requestData,id);

        return response(res, true, 200, 'Cart item is updated successfully!', rows[0]);        
    } catch(error){
        console.log('---Error in cart-add :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.deleteCartItem = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        const allowRoles = ["super-admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let cart_id = req.params.id;

        let { rows:check } = await cartService.selectCartByCartId(cart_id,id);

        if(check.length === 0){
            return response(res, false, 400, 'Cart item does not exist!');
        }

        let { rows } = await cartService.deleteCartItem(cart_id,id);

        return response(res, true, 200, 'Cart item is deleted successfully!', rows[0]);        
    } catch(error){
        console.log('---Error in cart-deleteCartItem :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};