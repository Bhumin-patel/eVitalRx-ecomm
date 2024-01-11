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
            order: orderRows[0],
            order_products: orderProductsRows 
        };
    } catch (error){
        await client.query('ROLLBACK');
        console.log('---Error in order-placeOrder-service :',error);
        return {};
    }
};