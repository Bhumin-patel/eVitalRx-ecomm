const jwt = require('jsonwebtoken');
const pool = require('../models/postgresql');
const { response } = require('./response');

exports.createJWTToken = async (payload) => {
	try{
		let token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRE,
		});
		return token;
	} catch (error){
		console.log('---Error in createJWTToken :',error);
        return response(res, false, 500, 'Something went wrong!', error);
	}
};

exports.verifyToken = async (req,res,next) => {
	try{
		if(!req.headers.authorization){
			return response(res, true, 401, 'Unauthorized. please login!');
		}

		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if(!decoded){
			return response(res, true, 401, 'Unauthorized. please login!');
		}
			
		let query = `select * from users where id = $1`;
		let queryInput = [
			decoded.id
		];

		let { rows } = await pool.query(query,queryInput);
		req.user = rows[0];
		next();
	} catch (error){
		console.log('---Error in verifyToken :',error);
        return response(res, false, 500, 'Something went wrong!', error);
	}
}