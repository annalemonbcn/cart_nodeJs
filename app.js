import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import productsRoutes from "./src/routes/products.routes.js";
import cartsRoutes from "./src/routes/carts.routes.js";
import viewsRoutes from "./src/routes/views.routes.js";

const PORT = 8080;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", viewsRoutes);

const http = createServer(app);

// const { Server } = require("socket.io");
// const io = new Server(http);

// io.on("connection", (socket) => {
//   console.log("connected");
// });

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
