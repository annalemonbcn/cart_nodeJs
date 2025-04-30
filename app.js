const express = require("express");
const path = require("path");

const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");

const PORT = 8080;
const app = express();
app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
