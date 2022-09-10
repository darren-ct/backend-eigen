const sequelize = require("../config/connect");
const {QueryTypes} = require('sequelize');
const {sendErr} = require("../helpers/index");

const Member = require("../models/member");
const Book = require("../models/book");
const Borrow = require("../models/borrow");

const dateDifference = require("date-difference");


module.exports.borrowBook = async(req,res) => {
       const {code} = req.user;
       const {book_code, qty} = req.body;

       if(qty < 1) return sendErr("Borrow between 1-2 books", 400, res);
       if(qty > 2) return sendErr("Maximum borrow 2 books", 400, res);

       try {
           // Check status
           const memberStatus = await Member.findOne({
            where : {code},
            attributes : ["is_penalized"]
           });

           if(memberStatus) return sendErr("Member is penalized", 400, res);

           // Check book stock left
            const book = await Book.findOne({
            where : {code:book_code},
            attributes : ["code","stock"]
            });

           if(qty === 1){
              if(book[0].stock === 0) return sendErr("Book stock empty", 400, res);
           } else {
              if(book.stock === 0 || book.stock === 1) return sendErr("Can't borrow 2 because stock doesnt reach 2 pcs", 400, res);
           };

          // Check member's borrowing
           const borrowing = await Borrow.findAll({
            where : {
                member_code : code
            },
            attributes : ["id"]
           });
           if(qty === 1){
            if(borrowing.length === 2) return sendErr("Member already borrowed 2 books currently", 400, res);
            } else {
            if(borrowing.length === 1 && qty === 2) return sendErr("Can't borrow 2 because member already borrowed 1 book currently", 400, res);
             };

          //   IF LOLOS SEMUA
          await Borrow.create({
            member_code : code,
            book_code
          });

          if(qty === 2) {
            // IF borrow 2 in 1 time, create new borrow row again
            await Borrow.create({
                member_code : code,
                book_code
              });
          };

          await Book.update({
               stock : book.stock - qty
          },{
            where : {
                 code : book_code
            }
          });

          return res.status(201).send({
             status : "Success",
             message : "Book successfuly borrowed"
          })

       } catch(err) {
           sendErr("Server Error",400,res)
       };
};

module.exports.returnBook = async(req,res) => {
   const book_code  = req.params.book_code;
   const user_code = req.user.code;

   try {
       const book = await Borrow.findOne({
        where : {user_code,book_code},
        attributes : ["createdAt"]
       });
    
       if(!book) return sendErr("You never borrowed that book", 400, res);

       // Check time
       const dateBorrowed = book.createdAt;
       const dateReturned = new Date().getDate();

       let difference = dateDifference(dateBorrowed, dateReturned);
       // returns string for example : '2d 2h 2m 2s'
       difference = difference.split(" ");
       // for ex: turn 2d 2h 2m 2s into ['2d','2h','2m', '2s']   
       const biggestTimeDur = difference[0];
       // take the first member of that array, for ex: '2d'
       const postfix = biggestTimeDur[biggestTimeDur.length - 1];
       // take the 'd' from '2d'    
 
   } catch(err) {
       sendErr("Server Error",400,res)
   }

};