const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();

// Middlewares
const verifyUser = require("./middlewares/verifyUser");
const verifyAdmin = require("./middlewares/verifyAdmin");

// Connect Sequelize
const sequelize = require("./config/connect");

sequelize.authenticate().then(()=>{
    console.log("connected")
});

// Middleware
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// ROUTES
app.use("/", require("./routes/auth"));

app.use(verifyUser);
app.use("/", require("./routes/borrow-return"));

app.use("/", verifyAdmin, require("./routes/books"));
app.use("/", verifyAdmin, require("./routes/members"));

// 
app.listen(process.env.PORT || 5000, ()=>{
    console.log("Connected")
});