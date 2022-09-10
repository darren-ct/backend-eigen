const express = require("express");
const router = express.Router();

const {registerAdmin, registerMember, loginAdmin, loginMember} = require("../../controllers/auth")

router.post("/register-member", registerMember);
router.post("/register-admin", registerAdmin);
router.post("/login-member",loginMember);
router.post("/login-admin",loginAdmin)

module.exports = router;