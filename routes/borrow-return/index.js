const express = require("express");
const router = express.Router();

const {borrowBook, returnBook} = require("../../controllers/borrow-return");

router.post("/borrow", borrowBook);
router.delete("/return/:book_code", returnBook);

module.exports = router;