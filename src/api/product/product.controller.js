const { response } = require('../../utils/response');
const productService = require('../../models/services/product.service');

exports.filter = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	} 
        
        const requestData = req.body;

        let { rows } = await productService.filter(requestData);

        return response(res, true, 200, 'Product list', rows);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};