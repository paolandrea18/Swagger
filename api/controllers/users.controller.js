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
        .json({ message: "Usuario o contraseña inválidos" });
    }
    console.log(result);
    if (await bcrypt.compare(req.body.password, result[0].Password)) {
      var payload = { username, password };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

      res.status(200).json({
        message: "Usuario logeado con éxito.",
        data: { accessToken: accessToken },
      });
    } else {
      return res
        .status(404)
        .json({ message: "Usuario o contraseña no encontrados." });
    }
  } catch (error) {
    console.log(error);
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

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(501).json({ error: "No se pudo obtener la información." });
  }
};

const GetUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await sequelize.query(
      `SELECT UserId, Username, Password, FirstName, LastName, Email, Address, Phone from user where UserId = ${userId}`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.status(200).json({ data: result });
  } catch (error) {
    res
      .status(501)
      .json({ error: "La información del usuario no pudo ser consultada." });
  }
};

const UpdateUser = async (req, res) => {
  const {
    userId,
    username,
    password,
    firstName,
    lastName,
    email,
    address,
    phone,
  } = req.body;
  try {
    await sequelize.query(
      `UPDATE user 
       set username = '${username}', 
       password = '${password}', 
       firstName = '${firstName}', 
       lastName = '${lastName}', 
       email = '${email}', 
       address = '${address}', 
       phone = '${phone}
       WHERE userId = '${userId}'`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.status(201).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    res.status(501).json({ error: "El usuario no pudo ser actualizado." });
  }
};

const DeleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    await sequelize.query(
      `UPDATE user set Enable = 0 where UserId = ${userId}`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.status(201).json({ message: "Usuario eliminado con éxito." });
  } catch (error) {
    res.status(501).json({ error: "El usuario no pudo ser eliminado." });
  }
};

module.exports = {
  CreateUser,
  Login,
  GetAllUsers,
  GetUserById,
  UpdateUser,
  DeleteUser,
};
