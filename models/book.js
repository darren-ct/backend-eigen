const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Book = sequelize.define("book", {
    code : {
        type: DataTypes.STRING,
        primaryKey:true,
    },
    title : {
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    author: {
        type: DataTypes.STRING,
        allowNull:false
    },
    stock : {
        type: DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:false,
    freezeTableName:true
});

Book.sync();

module.exports = Book;