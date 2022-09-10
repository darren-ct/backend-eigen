module.exports.sendErr = (message,code,res) => {
     res.status(code).send({
         status:"Error",
         message: message
     })
}