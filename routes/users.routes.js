// import files
const router = require("express").Router();
const service = require("../services/user.service");

// user router
router.get("/", service.getAllUsers);
router.get("/:id", service.getUsersById);
router.put("/:id", service.updateUsers);
router.delete("/:id", service.deleteUsersById);

// export
module.exports = router;
