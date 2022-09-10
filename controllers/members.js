const sequelize = require("../config/connect");
const {QueryTypes} = require("sequelize");
const {sendErr} = require("../helpers/index");

module.exports.getMembers = async(req,res) => {

    const query = `
    SELECT code, name, is_penalized, borrowing FROM member 
    `;
       
    try {
        const data = await sequelize.query(
            query, {type:QueryTypes.SELECT}
        );

        return res.status(201).send({
            status : "Success",
            data : {
                members : data
            }
        })
        
    } catch(err) {
        console.log(err)
        sendErr("Server Error", 400 ,res);
    }
};
