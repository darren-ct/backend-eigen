const express = require("express");
const router = express.Router();

const {getBooks,postBook} = require("../../controllers/books");

router.get("/books", getBooks);
router.post("/book", postBook);

module.exports = router;