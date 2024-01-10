const pool = require('../../models/postgresql');
const { response } = require('../../utils/response');
const addressService = require('../../models/services/address.service');

exports.addUpdate = async (req,res)=>{
    try{
        const { user_role,id } = req.user;
        const allowRoles = ["super-admin","admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const requestData = req.body;

        if(requestData.id){
            
        } else {

            let query;
            let queryInput;
            let data;
            if(requestData.store_id){
                data = await addressService.addStoreAddress(requestData);
            } else {
                data = await addressService.addUserAddress(requestData,id);
            }

            return response(res, true, 201, 'Address is created successfully!', data.rows[0]);
        }
    } catch(error){
        console.log('---Error in address-addUpdate :',error);
        return response(res, false, 500, 'Something went wrong!', error);
    }
};

// exports.filter = async (req,res)=>{
//     try{
//         const requestData = req.body;

//         if(requestData.id){
//             let query = `select * from cities where id = $1`;
//             let queryInput = [
//                 requestData.id
//             ];

//             let { rows } = await pool.query(query, queryInput);

//             return response(res, true, 200, 'City detail', rows)[0];
//         } else {
//             let query = `select * from cities`;

//             let { rows } = await pool.query(query);

//             return response(res, true, 200, 'City list', rows);
//         }
//     } catch(error){
//         console.log('---Error in city-filter :',error);
//         return response(res, false, 500, 'Something went wrong!', error);
//     }
// }

// exports.delete = async (req,res)=>{
//     try{
//         const { user_role } = req.user;
//         const allowRoles = ["super-admin"];
    	
// 		if (!allowRoles.includes(user_role)) {
//       		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
//     	}


//         let query = `delete from cities where id = $1`;
//         let queryInput = [
//             id = req.params.id
//         ];

//         await pool.query(query,queryInput);

//         return response(res, true, 200, 'City is deleted successfully!');        
//     } catch(error){
//         console.log('---Error in city-delete :',error);
//         return response(res, false, 500, 'Something went wrong!', error);
//     }
// }