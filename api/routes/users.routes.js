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
  "/:userLoggedId/:userId",
  [middleware.authenticateToken, middleware.userValidatorParam],
  userController.GetUserById
);

router.put(
  "/update",
  [middleware.authenticateToken, middleware.userValidatorBody],
  userController.UpdateUser
);

router.delete(
  "/delete/:userLoggedId/:userId",
  [middleware.authenticateToken, middleware.userValidatorParam],
  userController.DeleteUser
);

module.exports = router;
