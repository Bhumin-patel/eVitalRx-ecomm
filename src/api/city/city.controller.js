const pool = require('../../models/postgresql');
const { response } = require('../../utils/response');
const cityService = require('../../models/services/city.service');

exports.addUpdate = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const requestData = req.body;

        if(requestData.id){
            let { rows } = await cityService.update(requestData);

            if(rows.length === 0){
                return response(res, true, 400, 'City does not exists!', rows[0]);
            } 
            return response(res, true, 200, 'City is updated successfully!', rows[0]);
        } else {
            let { rows } = await cityService.add(requestData);

            return response(res, true, 201, 'City is created successfully!', rows[0]);
        }
    } catch(error){
        console.log('---Error in city-addUpdate :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.filter = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const requestData = req.body;

        let { rows } = await cityService.filter(requestData);

        return response(res, true, 200, 'City list', rows);
    } catch(error){
        console.log('---Error in city-filter :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
}

exports.delete = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        await cityService.delete(req.params.id);

        return response(res, true, 200, 'City is deleted successfully!');        
    } catch(error){
        console.log('---Error in city-delete :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
}