const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Borrow = sequelize.define("borrow", {
    borrow_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    member_code : {
        type: DataTypes.STRING,
        allowNull:false
    },
    book_code: {
        type: DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true,
    freezeTableName:true
});

Borrow.sync();

module.exports = Borrow;