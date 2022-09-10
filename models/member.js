const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Member = sequelize.define("member", {
    code : {
        type: DataTypes.STRING,
        primaryKey:true,
    },
    email : {
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    password : {
        type: DataTypes.STRING,
        allowNull:false
    },
    is_penalized : {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue : "false"
    },
    borrowing : {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue : 0
    }
},{
    timestamps:false,
    freezeTableName:true
});

Member.sync();

module.exports = Member;