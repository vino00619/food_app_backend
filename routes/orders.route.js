// import files
const router = require("express").Router();
const service = require("../services/orders.service");

// orders routers
router.get("/", service.getAllOrders);
router.get("/:id", service.getOrdersById);
router.get("/userId/:userId", service.getAllOrdersUserById);
router.post("/", service.createOrders);
router.put("/:id", service.updateOrders);
router.delete("/:id", service.deleteOrdersById);

// export
module.exports = router;
