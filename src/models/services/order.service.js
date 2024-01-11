const pool = require("../postgresql");
const format = require('pg-format');
const { response } = require('../../utils/response');
const cartService = require('../services/cart.service');

exports.placeOrder = async (cartProducts, requestData) => {
    
    const client = await pool.connect();
    try{

        let queryInput=[];
        
        let whereClause = cartProducts.map((item,index)=>{
            queryInput.push(item.product_id);
            return `$${index+1}`;
        });

        // read mrp from products
        let query = `   select mrp
                        from products
                        where id in (${whereClause.join(` , `)})`;

        const { rows: mrpRows } = await pool.query(query,queryInput);

        let total_price = mrpRows.reduce((accu,mrpRow)=>{
            return accu + mrpRow.mrp
        },0);

        query = `   select coupon_amount
                    from coupons
                    where id = ${requestData.coupon_id}`;
        
        let { rows: couponRows }= await pool.query(query);

        if(couponRows.length === 0){
            return response(res, false, 404, 'Coupon is not found!');
        }

        total_price-=couponRows[0].coupon_amount;

        await client.query('BEGIN');

        // insert order
        query = `   INSERT INTO orders (order_amount, 
                                        payment_status, 
                                        "order_status", 
                                        address_id, 
                                        user_id, 
                                        created_at) 
                    VALUES($1,$2,$3,$4,$5,$6) returning *; `;
        queryInput = [
            total_price,
            true,
            'PROCESSING',
            requestData.address_id,
            requestData.user_id,
            currentTS = new Date()
        ];

        let { rows: orderRows } = await client.query(query,queryInput);

        //insert order item 
        queryInput = cartProducts.map((item,index)=>{
            return `(
                        ${item.quantity},
                        ${mrpRows[index].mrp},
                        ${orderRows[0].id},
                        ${item.product_id}
                    )`;
        });

        query= `INSERT INTO order_products (quantity, 
                                            product_price, 
                                            order_id, 
                                            product_id) 
                VALUES ${queryInput.join(` , `)} returning *`       

        let { rows: orderProductsRows } = await client.query(query);

        //update stock
        queryInput = cartProducts.map((item)=>{
            return [
                item.quantity,
                item.product_id,
                item.store_id
            ];
        })
        query = `   update store_inventory
                    set stock = stock - $1
                    where (product_id, store_id) = ($2,$3)`

        queryInput.forEach( async (input) => {
            await client.query(query,input);
        });

        //delete cart
        await cartService.deleteCart(requestData.user_id);

        await client.query('COMMIT');

        return {
            error:false,
            order: orderRows[0],
            order_products: orderProductsRows 
        };
    } catch (error){
        await client.query('ROLLBACK');
        console.log('---Error in order-placeOrder-service :',error);
        return {
            error:true,
            order: {},
            order_products: []
        };
    }
};

exports.cancelOrder = async (order_id, user_id) => {
    let query = `   update orders
                    set order_status = 'CANCELED'
                    where id = $1 and user_id = $2 returning *`;
    
    let queryInput = [
        order_id,
        user_id
    ];

    return await pool.query(query,queryInput);
};

exports.listOrderItem = async (order_id) => {
    let query = `   select *
                    from order_products
                    where order_id = $1`;
    
    let queryInput = [
        order_id
    ];

    return await pool.query(query,queryInput);
};

exports.selectOrder = async (order_id, user_id) => {
    let query = `   select *
                    from orders
                    where id = $1 and user_id = $2`;
    
    let queryInput = [
        order_id,
        user_id
    ];

    return await pool.query(query,queryInput);
};

exports.filterOrder = async (data) => {
    
    let query = `   select *
                    from orders `;
    
    let queryInput;

    const keys = Object.keys(data);
    
    if(keys.length){
        let whereClause = keys.map((key,index)=>{
            return `${key} = $${index+1}`;
        })

        query = ` ${query} where ${whereClause.join(` and `)} order by created_at desc`;
        
        queryInput = Object.values(data);
    }

    return await pool.query(query,queryInput);
};