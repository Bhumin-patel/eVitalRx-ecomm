const pool = require("../postgresql");

exports.update = async (data) => {
    let query = `   update cities
                    set name = $1,
                        state_id= $2,
                        updated_at= $3
                    where id = $4 returning *`;
    let queryInput = [
        data.name,
        data.state_id,
        currentTS = new Date(),
        data.id
    ];

    return await pool.query(query, queryInput);
};

exports.add = async (data) => {
    const query = ` INSERT INTO cities (name,
                                        state_id,
                                        created_at) 
                    VALUES ($1,$2,$3) RETURNING *`;

    const queryInput = [
        data.name,
        data.state_id,
        currentTS = new Date()
    ];
    
    return await pool.query(query,queryInput);
};

exports.filter = async (data) =>{
  
    let query = `select * from cities`;
    let queryInput;
    
    const keys = Object.keys(data);

    if(keys.length){
        
        const whereClause = keys.map( (key,index) =>{
            return `${key} = $${index+1}`
        } );

        query = `   select * 
                    from cities
                    where ${whereClause.join(` and `)}`;
        
        queryInput = Object.values(data);
    }

    return await pool.query(query,queryInput);
};

exports.delete = async (id) =>{
    
    let query = `delete from cities where id = $1`;
    
    let queryInput = [
        id
    ];

    return await pool.query(query,queryInput);
};