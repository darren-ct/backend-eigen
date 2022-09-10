const {sendErr} = require("../helpers/index")

module.exports = async(req,res,next) => {
    const isAdmin = req.user.isAdmin;

    if(!isAdmin) return sendErr("This route is only for admins", 404, res);

    next();
}