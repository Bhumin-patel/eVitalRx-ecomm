const pool = require('../../models/postgresql');
const bcrypt = require('bcrypt');
const { createJWTToken } = require('../../utils/guard');
const { response } = require('../../utils/response');
const authService = require('../../models/services/auth.service');

exports.signup = async (req,res)=>{
    try{
        let requestdata = req.body;

        await authService.selectByEmail(requestdata.email);

        requestdata.password = await bcrypt.hash(requestdata.password, 8);
        requestdata.phone = requestdata.phone? requestdata.phone : null;

        let { rows } = await authService.addUser(requestdata);

        let token = await createJWTToken({
            id: rows[0].id,
			role: rows[0].user_role,
        });

        return response(res, true, 201, 'signup successfully!', { data: rows[0], token});  
    } catch(error){
        console.log('---Error in signup :',error);
        if(error.code === "23505"){
            return response(res, false, 403, 'Email or Phone Number already exists!', error);
        }
        
        return response(res,false,500, 'Something went wrong!', error);
    }
};

exports.signin = async (req,res)=>{
    try{
        let requestdata = req.body;

        let { rows } = await authService.selectByEmail(requestdata.email);

        let isMatch = await bcrypt.compare(requestdata.password, rows[0].password);

        if (!isMatch) {
            return response(res, true, 401, 'email or password is incorrect!');
        }

        let token = await createJWTToken({
            id: rows[0].id,
			role: rows[0].user_role,
        });

        return response(res, true, 200, 'signin successfully!', {data: rows[0], token});

    } catch(error){
        console.log('---Error in signin :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.forgetPassword = async (req,res)=>{
    try{
        let requestData = req.body;

        let { rows } = await authService.selectByEmail(requestData.email);

        if(rows.length === 0){
            return response(res, true, 404, 'Email does not exist!');
        }

        let otp = Math.floor(Math.random() * 9000) + 1000;
        let expire = Date.now() + 3*60*1000;
        expire = new Date(expire);

        await authService.updateOTP(otp,expire,requestData.email);

        return response(res, true, 200, 'OTP is send to your email!');

    } catch(error){
        console.log('---Error in verifyOtp :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

exports.resetForgetPassword = async (req,res)=>{
    try{
        let requestData = req.body;

        if(requestData.password !== requestData.conform_password){
            return response(res, false, 400, 'Password are not same!');
        }

        requestData.password = await bcrypt.hash(requestData.password,8);

        let { rows } = await authService.selectByOTP(requestData.otp);

        if(rows.length === 0){
            return response(res, false, 400, 'Please re-process!');
        }

        let { error } = await authService.setForgetPassword(requestData.password, rows[0].id);

        if(error){
            return response(res, false, 400, 'Please re-process!');
        }

        return response(res, true, 200, 'Password is set!');

    } catch(error){
        console.log('---Error in verifyOtp :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};