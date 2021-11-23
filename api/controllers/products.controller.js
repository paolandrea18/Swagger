const sequelize = require("../conexion");

const GetProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const result = await sequelize.query(
      `SELECT ProductId, Name, Image, Cost FROM Product WHERE ProductId = ${productId}`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(501).json({ error: "No se puede obtener la información." });
  }
};

const GetAll = async (req, res) => {
  try {
    const result = await sequelize.query(
      "SELECT ProductId, Name, Image, Cost FROM Product WHERE Available = 1",
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(501).json({ error: "No se puede obtener la información." });
  }
};

const CreateProduct = async (req, res) => {
  const { name, image, cost } = req.body;
  let arrayInsertProduct = [`${name}`, `${image}`, cost];

  try {
    await sequelize.query(
      "INSERT INTO Product(Name,Image,Cost) VALUES (?,?,?)",
      { replacements: arrayInsertProduct, type: sequelize.QueryTypes.INSERT }
    );

    res.status(201).json({ message: "Producto creado con éxito." });
  } catch (error) {
    res.status(501).json({ error: "El producto no pudo ser creado." });
  }
};

const UpdateProduct = async (req, res) => {
  const { productId, name, image, cost } = req.body;

  try {
    await sequelize.query(
      `UPDATE product set name = '${name}', image = '${image}', cost = ${cost} WHERE productId = ${productId}`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.status(201).json({ message: "Producto actualizado con éxito." });
  } catch (error) {
    res.status(501).json({ error: "El producto no pudo ser actualizado." });
  }
};

const DeleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    await sequelize.query(
      `UPDATE product set Available = 0 where ProductId = ${productId}`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.status(201).json({ message: "Producto eliminado con éxito." });
  } catch (error) {
    res.status(501).json({ error: "El producto no pudo ser eliminado." });
  }
};

module.exports = {
  GetProductById,
  GetAll,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
};
