const Book = require("../models/book");
const {sendErr} = require("../helpers/index");
const randomstring = require("randomstring");

module.exports.getBooks = async(req,res) => {

    try {
          const books = await Book.findAll();

          return res.status(201).send({
            status : "Success",
            data : {
                books
            }
          });

    } catch(err) {
        sendErr("Server Error",400,res)
    };

};

module.exports.postBook = async(req,res) => {
        const {title, author, stock} = req.body;

        // Checking format
        if(!minimumChecker(title,1)) return sendErr("Title minimum 1 character",400,res);
        if(!minimumChecker(author,1)) return sendErr("Author minimal 1 character",400,res);

       try {
          const newBook = await Book.create({
             code:randomstring.generate(4),
             title,
             author,
             stock
          });

          return res.status(201).send({
              status : "Success",
              data : {
                book : newBook
              }
          });
       } catch(err) {
           sendErr("Server Error",400,res)
       };
};