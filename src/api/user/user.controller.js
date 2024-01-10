const pool = require('../../models/postgresql');
const { response } = require('../../utils/response');
const bcrypt = require('bcrypt');
const userService = require('../../models/services/user.service');

exports.verifyAdmin = async(req,res) => {
    try{
        const { user_role } = req.user;
        const allowRoles = ["super-admin"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let requestData = req.body;
        
        const { rows } = await userService.verifyAdmin(requestData);

        return response(res, true, 200, 'User is verified successfully!', rows);
    } catch (error){
        console.log('---Error in verifyAdmin :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.resetPassword = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        let requestData = req.body;

        const allowRoles = ["super-admin","admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let { rows } = await userService.selectById(id);

        let isMatch = await bcrypt.compare(requestData.old_password, rows[0].password);

        if (!isMatch) {
            return response(res, true, 401, 'old password is incorrect!');
        }

        requestData.new_password = await bcrypt.hash(requestData.new_password, 8);

        await userService.updatePassword(requestData,id);

        return response(res, true, 200, 'Your password has been successfully reset!');

    } catch(error){
        console.log('---Error in resetPassword :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};