const express = require("express");
const path = require("path");
const routes = require("./router");
const ProductsManager = require("./productsManager/index");

const PORT = 8080;
const app = express();
app.use(express.json());

const productsFilePath = path.join(
  __dirname,
  "productsManager",
  "products.json"
);
const pm = new ProductsManager(productsFilePath);

const { cartsRoute, productsRoute } = routes;

// API: products
app.get(productsRoute, async (req, res) => {
  const products = await pm.getProducts();

  res.status(200).json({
    status: "success",
    code: 200,
    data: products,
  });
});

app.get(`${productsRoute}/:pid`, async (req, res) => {
  const { pid } = req.params;
  const product = await pm.getProductById(pid);

  if (!product)
    return res.status(404).json({
      status: "error",
      code: 404,
      message: `Product with id ${pid} doesn't exist`,
    });

  res.status(200).json({
    status: "success",
    code: 200,
    data: product,
  });
});

app.post(productsRoute, async (req, res) => {
  const product = req.body;

  try {
    await pm.addProduct(product);
    res.status(201).json({
      status: "success",
      code: 201,
      data: product,
      message: "Product created",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: error.message,
    });
  }
});

app.put(`${productsRoute}/:pid`, async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body;

  try {
    await pm.updateProduct(pid, fieldsToUpdate);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: error.message,
    });
  }
});

app.delete(`${productsRoute}/:pid`, async (req, res) => {
  const { pid } = req.params;

  try {
    await pm.deleteProduct(pid)
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: error.message,
    });
  }
});

// API: carts
app.post(cartsRoute, (req, res) => {});

app.get(`${cartsRoute}/:cid`, (req, res) => {});

app.post(`${cartsRoute}/:cid/product/:pid`, (req, res) => {});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
