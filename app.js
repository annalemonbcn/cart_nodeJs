import express from "express";
import { engine } from "express-handlebars";
import path, { dirname, join } from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { connectToDatabase } from "./src/config/db.js";

import productsRoutes from "./src/routes/products.routes.js";
import cartsRoutes from "./src/routes/carts.routes.js";
import viewsRoutes from "./src/routes/views.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.MONGO_PORT;

app.use(express.json());
app.use(express.static("public"));

const hbsHelpers = {
  eq: (a, b) => a === b,
};

app.engine(
  "handlebars",
  engine({
    helpers: hbsHelpers,
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", viewsRoutes);

const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
};

startServer();
