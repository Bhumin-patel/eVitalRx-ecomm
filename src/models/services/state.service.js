const pool = require("../postgresql");

exports.update = async (data) => {
    let query = `   update states
                    set name = $1,
                        state_code= $2,
                        country_id= $3 ,
                        updated_at= $4
                    where id = $5 returning *`;
            
    let queryInput = [
        data.name,
        data.state_code,
        data.country_id,
        currentTS = new Date(),
        data.id
    ];

    return await pool.query(query, queryInput);
};

exports.add = async (data) => {
    const query = ` INSERT INTO states (name,
                                        state_code,
                                        country_id,
                                        created_at) 
                    VALUES ($1,$2,$3,$4) RETURNING *`;

    const queryInput = [
        data.name,
        data.state_code,
        data.country_id,
        currentTS = new Date()
    ];
    
    return await pool.query(query,queryInput);
};

exports.filter = async (data) =>{
  
    let query = `select * from states`;
    let queryInput;
    
    const keys = Object.keys(data);

    if(keys.length){
        
        const whereClause = keys.map( (key,index) =>{
            return `${key} = $${index+1}`
        } );

        query = `   select * 
                    from states
                    where ${whereClause.join(` and `)}`;
        
        queryInput = Object.values(data);
    }

    return await pool.query(query,queryInput);
};

exports.delete = async (id) =>{
    
    let query = `delete from states where id = $1`;
    
    let queryInput = [
        id
    ];

    return await pool.query(query,queryInput);
};