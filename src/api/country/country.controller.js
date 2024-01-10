const pool = require('../../models/postgresql');
const { response } = require('../../utils/response');
const countryService = require('../../models/services/country.service');

exports.addUpdate = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const requestData = req.body;

        if(requestData.id){

            let { rows } = await countryService.update(requestData);

            if(rows.length === 0){
                return response(res, true, 400, 'Country does not exists!', rows[0]);
            } 
            return response(res, true, 200, 'Country is updated successfully!', rows[0]);
        } else {

            let { rows } = await countryService.add(requestData);

            return response(res, true, 201, 'Country is created successfully!', rows[0]);
        }
    } catch(error){
        console.log('---Error in country-addUpdate :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
}

exports.filter = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin","admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const requestData = req.body;

        let { rows } = await countryService.filter(requestData);

        return response(res, true, 200, 'Country list', rows);
    } catch(error){
        console.log('---Error in country-filter :',error);
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

        await countryService.delete(req.params.id);

        return response(res, true, 200, 'Country is deleted successfully!');        
    } catch(error){
        console.log('---Error in country-delete :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};