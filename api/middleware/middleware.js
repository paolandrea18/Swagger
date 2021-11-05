require("dotenv").config({ path: "../.env" });
const adminRol = process.env.ADMIN_ROL;
const sequelize = require("../conexion");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

async function validateAdmin(req, res, next) {
  const roleId = req.body.roleId;
  try {
    const result = await sequelize.query(
      `select RoleId, Description from role where RoleId = ${roleId}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (result[0].Description === adminRol) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "El usuario no tiene permisos para esta acción." });
    }
  } catch (error) {
    res.status(501).json({ err: "Error en validación." });
  }
}

async function actionValidator(req, res, next) {
  const roleId = req.params.roleId;
  try {
    const result = await sequelize.query(
      `select RoleId, Description from role where RoleId = ${roleId}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (result[0].Description === adminRol) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "El usuario no tiene permisos para esta acción." });
    }
  } catch (error) {
    res.status(501).json({ err: "Error en validación." });
  }
}

module.exports = {
  authenticateToken,
  validateAdmin,
  actionValidator,
};
