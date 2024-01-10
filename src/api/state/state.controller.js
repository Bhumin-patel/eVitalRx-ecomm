const pool = require('../../models/postgresql');
const { response } = require('../../utils/response');
const stateService = require('../../models/services/state.service');

exports.addUpdate = async (req,res)=>{
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const requestData = req.body;

        if(requestData.id){
            let { rows } = await stateService.update(requestData);

            if(rows.length === 0){
                return response(res, true, 400, 'State does not exists!', rows[0]);
            } 
            return response(res, true, 200, 'State is updated successfully!', rows[0]);
        } else {
            let { rows } = await stateService.add(requestData);

            return response(res, true, 201, 'State is created successfully!', rows[0]);
        }
    } catch(error){
        console.log('---Error in state-addUpdate :',error);
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

        let { rows } = await stateService.filter(requestData);

        return response(res, true, 200, 'State list', rows);
    } catch(error){
        console.log('---Error in state-filter :',error);
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

        await stateService.delete(req.params.id);

        return response(res, true, 200, 'State is deleted successfully!');        
    } catch(error){
        console.log('---Error in state-delete :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
}