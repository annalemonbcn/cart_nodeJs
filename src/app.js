import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs";

const swaggerDocument = YAML.load('./swagger.yaml'); 

import { connectToDatabase } from "./db/config/index.js";

import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.MONGO_PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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