const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");

const productsRoutes = require("./src/routes/products.routes");
const cartsRoutes = require("./src/routes/carts.routes");

const PORT = 8080;
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

const http = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(http);

io.on("connection", (socket) => {
  console.log("connected");

  // socket.on("message", (data) => {
  //   console.log("data", data);
  // });
});

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
