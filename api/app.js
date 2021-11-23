const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//Middelware
app.use(express.json());
app.use(cors());

//Routes
const userRoute = require("./routes/users.routes");
const productRoute = require("./routes/products.routes");
const orderRoute = require("./routes/order.routes");

// Use Route
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

app.listen(port, () => {
  console.log(`Server on port: ${port}`);
});

module.exports = app;
