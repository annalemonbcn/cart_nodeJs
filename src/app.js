import express from "express";
import "dotenv-flow/config";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import passport from "passport";
const swaggerDocument = YAML.load("./swagger.yaml");
import { startPassport } from "./config/passport/index.js";
import { connectToDatabase } from "./config/db/index.js";
import router from "#routes/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

startPassport();
app.use(passport.initialize());

startPassport();
app.use(passport.initialize());

app.use(router);

const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
};

startServer();

export default app;
