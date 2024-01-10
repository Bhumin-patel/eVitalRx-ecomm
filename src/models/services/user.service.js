const pool = require('../postgresql');

exports.verifyAdmin = async (data) =>{
    
    let query = `   update users
                    set is_admin = true
                    where email = $1
                    returning *`
    
    let queryInput = [
        data.email
    ];

    return await pool.query(query,queryInput);
};

exports.selectById = async (id) =>{
    
    let query = `select * from users where id = $1`;
        
    let queryInput = [
        id
    ];

    return await pool.query(query,queryInput);
};

exports.updatePassword = async (data,id) =>{
    
    let query = `   update users
                    set password = $1
                    where id = $2`
        
    let queryInput = [
        data.new_password,
        id
    ]

    return await pool.query(query,queryInput);
};