const pool = require('../../models/postgresql');
const bcrypt = require('bcrypt');
const { createJWTToken } = require('../../utils/guard');
const { response } = require('../../utils/response');

exports.signup = async (req,res)=>{
    try{
        let requestdata = req.body;

        let query = `select * from users where email = $1`;
        let queryInput = [
            requestdata.email
        ];

        await pool.query(query,queryInput);

        requestdata.password = await bcrypt.hash(requestdata.password, 8);
        requestdata.phone = requestdata.phone? requestdata.phone : null;

        query = `insert into users (first_name,
                                    last_name,
                                    email,
                                    phone,
                                    password,
                                    user_role,
                                    user_profile_picture,
                                    created_at)
                values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
        
        queryInput = [
            requestdata.first_name,
            requestdata.last_name,
            requestdata.email,
            requestdata.phone,
            requestdata.password,
            requestdata.user_role,
            requestdata.user_profile_picture,
            currentTS = new Date()
        ];

        let { rows } = await pool.query(query,queryInput);

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

        let query = `select * from users where email = $1`;
        let queryInput = [
            requestdata.email
        ];

        let { rows } = await pool.query(query,queryInput);

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

        let query = `select * from users where email = $1`;
        let queryInput = [
            requestData.email
        ];

        let { rows } = await pool.query(query,queryInput);

        if(rows.length === 0){
            return response(res, true, 404, 'Email does not exist!');
        }

        let otp = Math.floor(Math.random() * 9000) + 1000;
        let expire = Date.now() + 3*60*1000;
        expire = new Date(expire);

        query = `   update users
                    set otp = $1, otp_expire = $2
                    where email = $3`;
        queryInput = [
            otp,
            expire,
            requestData.email
        ];

        await pool.query(query,queryInput);

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

        let query = `   select * 
                        from users
                        where otp = $1 and otp_expire > $2`;
        let queryInput = [
            requestData.otp,
            currentTS =  new Date()
        ];

        let { rows } = await pool.query(query,queryInput);

        if(rows.length === 0){
            return response(res, false, 400, 'Please re-process!');
        }

        query = `   update users
                    set password = $1, otp = null, otp_expire = null
                    where id = $2`;
        queryInput = [
            requestData.password,
            rows[0].id
        ];

        let { error } = await pool.query(query,queryInput);

        if(error){
            return response(res, false, 400, 'Please re-process!');
        }

        return response(res, true, 200, 'Password is set!');

    } catch(error){
        console.log('---Error in verifyOtp :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};