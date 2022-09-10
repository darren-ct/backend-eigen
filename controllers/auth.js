const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const Member = require("../models/member");
const Admin = require("../models/admin");

const {sendErr} = require("../helpers/index");
const {emailChecker, minimumChecker} = require("../helpers/checking");


module.exports.registerMember = async(req,res) => {
    const{name,email,password} = req.body;
    // Checking format
    if(!emailChecker(email) || !minimumChecker(email,1)) return sendErr("Email format invalid",400,res);
    if(!minimumChecker(name,1)) return sendErr("Name minimum 1 character",400,res);
    if(!minimumChecker(password,8)) return sendErr("Password minimal 8 characters",400,res);

    try { 
        const duplicate = await Member.findOne({
            where : {email}
        });

        if(duplicate) return sendErr("Email is already registered",400,res);

        // Kalau lolos
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt);

        // Create data and token
        const newMember = await Member.create({
            code: randomstring.generate(4),
            name,
            email,
            password:hashed
        });

        const token = jwt.sign({
            code : newMember.code,
            isAdmin : false,
            iat : Date.now(),
            expires : "1d"}, process.env.SECRET , {
                expiresIn:"1d"
        });

        return res.status(201).send({
            status : "Success",
            data : {
                user : {
                    name : newMember.name,
                    code : newMember.code,
                    isAdmin : false,
                    token
                }
            }
        })


    } catch(err) {
         sendErr("Server Error", 400 , res)
    };
};

module.exports.registerAdmin = async(req,res) => {
    const{name,email,password} = req.body;
    // Checking format
    if(!emailChecker(email) || !minimumChecker(email,1)) return sendErr("Email format invalid",400,res);
    if(!minimumChecker(name,1)) return sendErr("Name minimum 1 character",400,res);
    if(!minimumChecker(password,8)) return sendErr("Password minimal 8 characters",400,res);

    try { 
        const duplicate = await Admin.findOne({
            where : {email}
        });

        if(duplicate) return sendErr("Email is already registered",400,res);

        // Kalau lolos
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt);

        // Create data and token
        const newAdmin = await Admin.create({
            code: randomstring.generate(4),
            name,
            email,
            password:hashed
        });

        const token = jwt.sign({
            code : newAdmin.code,
            isAdmin : true,
            iat : Date.now(),
            expires : "1d"}, process.env.SECRET , {
                expiresIn:"1d"
        });

        return res.status(201).send({
            status : "Success",
            data : {
                user : {
                    name : newAdmin.name,
                    code : newAdmin.code,
                    isAdmin : true,
                    token
                }
            }
        })


    } catch(err) {
         sendErr("Server Error", 400 , res)
    };
};

module.exports.loginMember = async(req,res) => {
    const{email,password} = req.body;

    try{
        // Check member
       const match = await Member.findOne({
          where : {email}
       });

       if(!match) return sendErr("Email not yet registered", 400, res);
    
       //Check password
       const isMatch = bcrypt.compareSync(password,match.password);

       if(!isMatch) return sendErr("Wrong password", 400, res);

       //Beri token    
       const token = jwt.sign({
        code : match.code,
        isAdmin : false,
        iat : Date.now(),
        expires : "1d"}, process.env.SECRET , {
            expiresIn:"1d"
       });

       return res.status(201).send({
          status : "Success",
          data : {
            user : {
                name : match.name,
                code : match.code,
                isAdmin : false,
                token
            }
          }
       })

    } catch(err) {
       sendErr("Server Error", 400 ,res)
    };
};

module.exports.loginAdmin = async(req,res) => {
    const{email,password} = req.body;

    try{
        // Check member
       const match = await Admin.findOne({
          where : {email}
       });

       if(!match) return sendErr("Email not yet registered", 400, res);
    
       //Check password
       const isMatch = bcrypt.compareSync(password,match.password);

       if(!isMatch) return sendErr("Wrong password", 400, res);

       //Beri token    
       const token = jwt.sign({
        code : match.code,
        isAdmin : true,
        iat : Date.now(),
        expires : "1d"}, process.env.SECRET , {
            expiresIn:"1d"
       });

       return res.status(201).send({
          status : "Success",
          data : {
            user : {
                name : match.name ,
                code : match.code,
                isAdmin : true,
                token
            }
          }
       });

    } catch(err) {
       sendErr("Server Error", 400 ,res)
    };
};