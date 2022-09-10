const Member = require("../models/member");
const Book = require("../models/book");
const Borrow = require("../models/borrow");

const dateDifference = require("date-difference");

const {sendErr} = require("../helpers/index");


module.exports.borrowBook = async(req,res) => {
       const {code} = req.user;
       let {book_code, qty} = req.body;
       qty = Number(qty)

       if(qty < 1) return sendErr("Borrow between 1-2 books", 400, res);
       if(qty > 2) return sendErr("Maximum borrow 2 books", 400, res);

       try {
           // Check status
           const memberStatus = await Member.findOne({
            where : {code},
            attributes : ["is_penalized","borrowing"]
           });

           if(memberStatus.is_penalized === "true") return sendErr("Member is penalized", 400, res);

           console.log(memberStatus.borrowing)

           // Check book stock left
            const book = await Book.findOne({
            where : {code:book_code},
            attributes : ["code","stock"]
            });

           if(qty === 1){
              if(book.stock === 0) {return sendErr("Book stock empty", 400, res) }
           } else {
              if(book.stock === 0 || book.stock === 1) { return sendErr("Can't borrow because stock doesnt reach 2 pcs", 400, res) }
           };

          // Check member's borrowing
           if(qty === 1){
            if(memberStatus.borrowing === 2) return sendErr("Member already borrowed 2 books currently", 400, res);
            } else {
            if(memberStatus.borrowing > 0 && qty === 2) return sendErr("Can't borrow 2 because member already borrowed 1 or 2 books currently", 400, res);
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

          await Member.update({
            borrowing : Number(memberStatus.borrowing) + Number(qty)
          },{
            where : {
              code : code
            }
          });

          return res.status(201).send({
             status : "Success",
             message : "Book successfuly borrowed"
          })

       } catch(err) {
           console.log(err)
           sendErr("Server Error",400,res)
       };
};

module.exports.returnBook = async(req,res) => {
   const book_code  = req.params.book_code;
   const member_code = req.user.code;


   try {
       const book = await Borrow.findOne({
        where : {member_code,book_code},
        attributes : ["createdAt","borrow_id"]
       });
    
       if(!book) return sendErr("You never borrowed that book", 400, res);

       const member = await Member.findOne({
        where : {code:member_code},
        attributes : ["borrowing"]
       })

       // Check time
       const dateBorrowed = book.createdAt;
       const dateReturned = new Date();

       let difference = dateDifference(dateBorrowed, dateReturned);
       // returns string for example : '2d 2h 2m 2s'
       difference = difference.split(" ");
       // for ex: turn 2d 2h 2m 2s into ['2d','2h','2m', '2s']   
       const biggestTimeDur = difference[0];
       // take the first member of that array, for ex: '2d'
       const postfix = biggestTimeDur[biggestTimeDur.length - 1];
       // take the 'd' from '2d'    

      //  LOGIC
       if( (postfix === "d" && Number(biggestTimeDur.slice(0,biggestTimeDur.length - 1)) > 7) || (postfix === "y")){
          //  Penalize member
           await Member.update({
            is_penalized : "true",
            borrowing : member.borrowing - 1
           }, { where : { code : member_code}});

          //  In 3 days, unpenalized
           setTimeout(async()=>{
               await Member.update({
               is_penalized : "false"
             }, { where : { code : member_code}});
           },259200000 );

          //  Update Borrow Table, Book Table, Member Table
          const bookStock = await Book.findOne({
            where: {code:book_code},
            attributes : ["stock"]
          });

          await Book.update({
                stock : bookStock.stock + 1
          },{
            where : { code : book_code}
          });

          await Borrow.destroy({
            where : {
              borrow_id : book.borrow_id
            }
          });

          await Member.update({
            borrowing : member.borrowing - 1
           }, { where : { code : member_code}});

          return res.status(201).send({
             status : "Success",
             message : "Book returned, but you are late so you are penalized for 3 days."
          });

       } else {

            //  Update Borrow Table and Book Table
          const bookStock = await Book.findOne({
            where: {code:book_code},
            attributes : ["stock"]
          });

          await Book.update({
                stock : bookStock.stock + 1
          },{
             where : {
                 code : book_code
             }
          });

          await Borrow.destroy({
            where : {
              borrow_id : book.borrow_id
            }
          });

          await Member.update({
            borrowing : member.borrowing - 1
           }, { where : { code : member_code}});

          return res.status(201).send({
             status : "Success",
             message : "Book returned"
          });
       };
 
   } catch(err) {
       console.log(err);
       sendErr("Server Error",400,res)
   }

};