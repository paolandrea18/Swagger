const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");
const middleware = require("../middleware/middleware");

router.get("/getById/:productId", productController.GetProductById);

router.get("/", productController.GetAll);

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
  "/:roleId/:productId",
  [middleware.authenticateToken, middleware.actionValidator],
  productController.DeleteProduct
);

module.exports = router;
