const pool = require("../postgresql");

exports.selectItemFromCart = async (data) => {
    let query = `   select *
                    from carts
                    where user_id = $1 and product_id = $2`;
    let queryInput = [
        data.user_id,
        data.product_id
    ];

    return await pool.query(query, queryInput);
};

exports.add = async (data) => {
    let query = `   INSERT INTO carts ( user_id, 
                                        quantity,  
                                        product_id, 
                                        store_id,
                                        created_at) 
                    VALUES($1,$2,$3,$4,$5) returning *;
    `;
    let queryInput = [
        data.user_id,
        data.quantity,
        data.product_id,
        data.store_id,
        currentTS = new Date()
    ];

    return await pool.query(query, queryInput);
};

exports.selectCartItems = async (id) => {
    let query = `   select *
                    from carts
                    where user_id = $1`;
    let queryInput = [
        id
    ];

    return await pool.query(query, queryInput);
};

exports.selectCartByCartId = async (cart_id,user_id) => {
    let query = `   select *
                    from carts
                    where id = $1 and user_id = $2`;
    let queryInput = [
        cart_id,
        user_id
    ];

    return await pool.query(query, queryInput);
};

exports.updateCartItem = async (data,id) => {
   
    const cart_id = data.id;
    delete data.id;

    const keys = Object.keys(data);

    let setClause = keys.map((key,index)=>{
        return `${key} = $${index+1}`
    })

    let query = `   update carts 
                    set ${setClause.join(` , `)}
                    where id = $2 and user_id = $3 returning *`;
    
    let queryInput = [
        ...Object.values(data),
        cart_id,
        id
    ];

    return await pool.query(query, queryInput);
};

exports.deleteCartItem = async (cart_id,user_id) => {
   
    let query = `   delete from carts
                    where id = $1 and user_id = $2`;
    
    let queryInput = [
        cart_id,
        user_id
    ];

    return await pool.query(query, queryInput);
};

exports.deleteCart = async (user_id) => {
   
    let query = `   delete from carts
                    where user_id = $2`;
    
    let queryInput = [
        user_id
    ];

    return await pool.query(query, queryInput);
};