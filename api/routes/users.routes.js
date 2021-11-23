const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const middleware = require("../middleware/middleware");

router.post("/", userController.CreateUser);
router.post("/login", userController.Login);
router.get(
  "/getAllUsers/:roleId",
  [middleware.authenticateToken, middleware.actionValidator],
  userController.GetAllUsers
);
router.get(
  "/:roleId/:userId",
  [middleware.authenticateToken, middleware.actionValidator],
  userController.GetUserById
);

router.put(
  "/",
  [middleware.authenticateToken, middleware.userValidatorBody],
  userController.UpdateUser
);

router.delete(
  "/:userId",
  middleware.authenticateToken,
  userController.DeleteUser
);

module.exports = router;
