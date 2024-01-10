const { response } = require('./response');

exports.validation = (req,res,next,schema) => { 
	try{
		let { error } = schema.validate(req.body);
		if (error) {
			return response(res, false, 400, "Field validation error.", error);
		} else {
			next();
		}
	} catch(error) {
		console.log('---Error in validation :',error);
        return response(res, false, 500, 'Something went wrong!', error);
	}
}