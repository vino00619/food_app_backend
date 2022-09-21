// import files
const router = require("express").Router();
const service = require("../services/products.service");

// products router
router.get("/", service.getAllProducts);
router.get("/:id", service.getProductsById);
router.post("/", service.createProducts);
router.put("/:id", service.updateProducts);
router.delete("/:id", service.deleteProductsById);

// export
module.exports = router;
