const pool = require('../postgresql');

exports.filter = async (data) =>{
  
    let query = `select * from products`;
    let queryInput;

    if(data.store_id){
        query = `   select products.* 
                    from products join store_inventory
                    on products.id = store_inventory.product_id`
    }
    
    const keys = Object.keys(data);

    if(keys.length){

        let whereClause = keys.map( (key,index) =>{
            if(key === 'price'){
                return `${key} <= $${index+1}`;
            } else if(key === 'name'){
                data[key] = `%${data[key]}%`;
                return `lower(${key}) LIKE $${index+1}`;
            }
            return `${key} = $${index+1}`;
        } );

        query = ` ${query} where ${whereClause.join(` and `)}`;
        
        queryInput = Object.values(data);
    }

    return await pool.query(query,queryInput);
};