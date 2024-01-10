exports.response = (res, success = true, statusCode = 200, message = "", data = {}) => {
	const resData = {
		success,
        statusCode,
		message,
		data
	};
	return res.status(statusCode).send(resData);
};