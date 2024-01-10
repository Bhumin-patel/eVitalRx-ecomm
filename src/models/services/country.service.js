const pool = require("../postgresql");

exports.update = async (data) => {
    let query = `   update countries
                    set name = $1,
                        country_code= $2,
                        country_flag_image= $3,
                        currency=$4 ,
                        updated_at= $5
                    where id = $6 returning *`;
    
    let queryInput = [
        data.name,
        data.country_code,
        data.country_flag_image,
        data.currency,
        currentTS = new Date(),
        data.id
    ];

    return await pool.query(query, queryInput);
};

exports.add = async (data) => {
    let query = `INSERT INTO countries (name,
                                        country_code,
                                        country_flag_image,
                                        currency,
                                        created_at) 
                VALUES ($1,$2,$3,$4,$5) RETURNING *`;
                
    let queryInput = [
        data.name,
        data.country_code,
        data.country_flag_image,
        data.currency,
        currentTS = new Date()
    ];
    
    return await pool.query(query,queryInput);
};

exports.filter = async (data) =>{
  
    let query = `select * from countries`;
    let queryInput;
    
    const keys = Object.keys(data);

    if(keys.length){
        
        const whereClause = keys.map( (key,index) =>{
            return `${key} = $${index+1}`
        } );

        query = `   select * 
                    from countries
                    where ${whereClause.join(` and `)}`;
        
        queryInput = Object.values(data);
    }

    return await pool.query(query,queryInput);
};

exports.delete = async (id) =>{
    
    let query = `delete from countries where id = $1`;
    
    let queryInput = [
        id
    ];

    return await pool.query(query,queryInput);
};
