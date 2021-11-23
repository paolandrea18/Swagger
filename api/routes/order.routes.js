const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const middleware = require("../middleware/middleware");

router.post(
  "/createOrder",
  middleware.authenticateToken,
  orderController.CreateOrder
);

router.get(
  "/getAllOrders/:roleId",
  [middleware.authenticateToken, middleware.actionValidator],
  orderController.GetAllOrders
);

router.get(
  "/:userId",
  middleware.authenticateToken,
  orderController.GetOrdersByUserId
);

router.put(
  "/updateOrderStatus",
  [middleware.authenticateToken, middleware.validateAdmin],
  orderController.UpdateOrderStatus
);

module.exports = router;
