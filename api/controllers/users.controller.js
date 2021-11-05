require("dotenv").config({ path: "../.env" });
const sequelize = require("../conexion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CreateUser = async (req, res) => {
  const {
    username,
    roleId,
    password,
    firstName,
    lastName,
    email,
    address,
    phone,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let arrayInsertUser = [
      `${username}`,
      roleId,
      `${hashedPassword}`,
      `${firstName}`,
      `${lastName}`,
      `${email}`,
      `${address}`,
      `${phone}`,
      true,
    ];

    await sequelize.query(
      "INSERT INTO User (Username, RoleId, Password, FirstName, LastName, Email, Address, Phone, Enable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      { replacements: arrayInsertUser, type: sequelize.QueryTypes.INSERT }
    );

    res.status(201).json({ message: "El usuario ha sido creado con éxito." });
  } catch (e) {
    res.status(501).json({ error: `Error en la creación de usuario.` });
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await sequelize.query(
      `SELECT Username, Password FROM user WHERE Username='${username}'`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (result == null) {
      return res
        .status(400)
        .json({ message: "Ingrese un usuario y contraseña válida." });
    }

    if (await bcrypt.compare(req.body.password, result[0].Password)) {
      var payload = { username, password };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

      res.status(201).json({
        message: "Usuario logeado con éxito.",
        data: { accessToken: accessToken },
      });
    } else {
      return res
        .status(404)
        .json({ message: "Usuario o contraseña inválida." });
    }
  } catch (error) {
    res.status(501).json({ error: `Error en login del usuario.` });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const result = await sequelize.query(
      "SELECT * FROM user WHERE Enable = 1",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({ data: result });
  } catch (error) {
    res.status(501).json({ error: "No se pudo obtener los usuarios." });
  }
};

const GetUserById = async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await sequelize.query(
      `SELECT UserId, Username, Password, FirstName, LastName, Email, Address, Phone from user where UserId = ${userId}`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.status(201).json({ data: result });
  } catch (error) {
    res
      .status(501)
      .json({ msg: "La información del usuario no puede ser consultada." });
  }
};

const DeleteUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    await sequelize.query(
      `UPDATE user set Enable = 0 where UserId = ${userId}`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.status(201).json({ msg: "Usuario eliminado con éxito." });
  } catch (error) {
    res.status(501).json({ msg: "El usuario no pudo ser eliminado." });
  }
};

module.exports = {
  CreateUser,
  Login,
  GetAllUsers,
  GetUserById,
  DeleteUser,
};
