const pool = require('../postgresql');

exports.addStoreAddress = async (data) =>{
    let query = `insert into addresses (address,
                                        city_id,
                                        store_id,
                                        created_at)
                values($1,$2,$3,$4) returning *`;

    let queryInput = [
        data.address,
        data.city_id,
        data.store_id,
        currentTS = new Date()
    ];

    return await pool.query(query,queryInput);
};

exports.addUserAddress = async (data,id) =>{
    let query =`INSERT INTO addresses ( address,
                                        city_id,
                                        user_id,
                                        address_type,
                                        created_at) 
                VALUES ($1,$2,$3,$4,$5) RETURNING *`;

    let queryInput = [
        data.address,
        data.city_id,
        id,
        data.address_type,
        currentTS = new Date()
    ];

    return await pool.query(query,queryInput);
};