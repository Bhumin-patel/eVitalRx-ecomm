const pool = require('../postgresql');

exports.selectByEmail = async (email) => {
    let query = `select * from users where email = $1`;
        let queryInput = [
            email
        ];

    return await pool.query(query,queryInput);
};

exports.addUser = async (data) => {
    let query = `insert into users (first_name,
                                    last_name,
                                    email,
                                    phone,
                                    password,
                                    user_role,
                                    user_profile_picture,
                                    created_at)
                values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;

    let queryInput = [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.password,
        data.user_role,
        data.user_profile_picture,
        currentTS = new Date()
    ];

    return await pool.query(query,queryInput);
};

exports.updateOTP = async (otp,expire,email) => {
    let query = `   update users
                    set otp = $1, otp_expire = $2
                    where email = $3`;
    
    let queryInput = [
        otp,
        expire,
        email
    ];

    return await pool.query(query,queryInput);
};

exports.selectByOTP = async (otp) => {
    let query = `   select * 
                    from users
                    where otp = $1 and otp_expire > $2`;
    let queryInput = [
        otp,
        currentTS =  new Date()
    ];

    return await pool.query(query,queryInput);
};

exports.setForgetPassword = async (password,id) => {
    let query = `   update users
                    set password = $1, otp = null, otp_expire = null
                    where id = $2`;
    let queryInput = [
        password,
        id
    ];

    return await pool.query(query,queryInput);
};