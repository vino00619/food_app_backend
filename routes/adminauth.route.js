// import files
const service = require("../services/adminauth.service");
const router = require("express").Router();

// admin auth router
router.post("/register", service.register);
router.post("/login", service.login);

// export
module.exports = router;
