const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Admin = sequelize.define("admin", {
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
    }
},{
    timestamps:false,
    freezeTableName:true
});

Admin.sync();

module.exports = Admin;