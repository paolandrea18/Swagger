const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");
const middleware = require("../middleware/middleware");

router.get("/getById", productController.GetProductById);

router.get("/products", productController.GetAll);

router.post(
  "/",
  [middleware.authenticateToken, middleware.validateAdmin],
  productController.CreateProduct
);

router.put(
  "/",
  [middleware.authenticateToken, middleware.validateAdmin],
  productController.UpdateProduct
);

router.delete(
  "/",
  [middleware.authenticateToken, middleware.validateAdmin],
  productController.DeleteProduct
);

module.exports = router;
