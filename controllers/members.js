const sequelize = require("../config/connect");
const {QueryTypes} = require("sequelize");

module.exports.getMembers = async(req,res) => {

    const query = `
    SELECT member.code, name, is_penalized, COUNT(member.code) AS borrowed_qty
    FROM member INNER JOIN borrow
    ON member.code = borrow.member_code
    GROUP BY member.code
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
        sendErr("Server Error", 400 ,res);
    }
};
