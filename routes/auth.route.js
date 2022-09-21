// import files
const service = require("../services/auth.service");
const router = require("express").Router();

// auth router
router.post("/register", service.register);
router.post("/login", service.login);
router.post("/forget-password", service.forgetPassword);
router.post("/reset-password/:id/:token", service.resetPassword);
router.post("/sendmail", service.sendmail);

// export
module.exports = router;
