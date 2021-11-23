const sequelize = require("../conexion");

const GetAllOrders = async (req, res) => {
  try {
    const result = await sequelize.query(
      "select os.Description Status, o.OrderTime, o.orderId, o.description OrderDescription, p.Description PayDescription, o.Total, concat_ws(' ', u.FirstName, u.LastName) FullUserName, u.address from orders o inner join orderstatus os on os.OrderStatusId = o.OrderStatusId inner join paytype p on p.PayTypeId = o.PayTypeId inner join user u on u.UserId = o.UserId order by os.OrderStatusId",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(501).json({ error: "No se puede obtener la información." });
  }
};

const GetOrdersByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await sequelize.query(
      `select os.Description Status, 
      o.OrderTime, 
      o.orderId, 
      o.description OrderDescription, 
      p.Description PayDescription,
       o.Total, 
       concat_ws(' ', u.FirstName, u.LastName) FullUserName, 
       u.address 
       from orders o 
       inner join orderstatus os on os.OrderStatusId = o.OrderStatusId 
       inner join paytype p on p.PayTypeId = o.PayTypeId 
       inner join user u on u.UserId = o.UserId 
       where u.userId = ${userId} 
       order by o.OrderId desc`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      res.status(200).json({ data: result });
    } else {
      res.status(204).json({ message: "El usuario no posee órdenes." });
    }
  } catch (error) {
    res.status(501).json({ error: "No se puede obtener la información" });
  }
};

const CreateOrder = async (req, res) => {
  const { userId, payTypeId, description, total, listProduct } = req.body;
  try {
    let arrayInsertOrder = [
      userId,
      payTypeId,
      1,
      `${description}`,
      total,
      new Date(),
    ];
    const order = await sequelize.query(
      "INSERT INTO orders(UserId, PayTypeId, OrderStatusId, Description, Total, OrderTime) VALUES (?,?,?,?,?,?)",
      { replacements: arrayInsertOrder, type: sequelize.QueryTypes.INSERT }
    );
    listProduct.forEach(async (product) => {
      let arrayOrderDetail = [order[0], product.productId, product.quantity];
      await sequelize.query(
        "INSERT INTO orderdetail(OrderId, ProductId, Quantity) VALUES (?,?,?)",
        {
          replacements: arrayOrderDetail,
          type: sequelize.QueryTypes.INSERT,
        }
      );
    });
    res.status(201).json({ message: "Orden creada con éxito." });
  } catch (error) {
    res.status(501).json({ error: "No se pudo crear la orden." });
  }
};

const UpdateOrderStatus = async (req, res) => {
  const { orderStatusId, OrderId } = req.body;

  try {
    await sequelize.query(
      `update orders set OrderStatusId = ${orderStatusId} where OrderId = ${OrderId}`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res
      .status(201)
      .json({ message: "El estado de la orden ha sido actualizado." });
  } catch (error) {
    res
      .status(501)
      .json({ error: "El estado de la orden no pudo ser actualizado" });
  }
};

module.exports = {
  CreateOrder,
  GetAllOrders,
  GetOrdersByUserId,
  UpdateOrderStatus,
};
