const express = require("express");
const path = require("path");
const routes = require("./router");
const ProductsManager = require("./productsManager/index");
const CartsManager = require("./cartsManager/index");

const PORT = 8080;
const app = express();
app.use(express.json());

const productsFilePath = path.join(
  __dirname,
  "productsManager",
  "products.json"
);
const pm = new ProductsManager(productsFilePath);

const cartsFilePath = path.join(__dirname, "cartsManager", "carts.json");
const cm = new CartsManager(cartsFilePath);

const { cartsRoute, productsRoute } = routes;

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
    await pm.deleteProduct(pid);
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

app.post(cartsRoute, async (req, res) => {
  try {
    await cm.addCart();
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Cart created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: error.message,
    });
  }
});

app.get(`${cartsRoute}/:cid`, async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cm.getCartById(cid);
    res.status(200).json({
      status: "success",
      code: 200,
      data: cart,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: error.message,
    });
  }
});

app.post(`${cartsRoute}/:cid/product/:pid`, async (req, res) => {
  const { cid, pid } = req.params;

  const product = { id: pid };

  try {
    await cm.addProductToCart(cid, product);
    res.status(200).json({
      status: "success",
      code: 200,
      message: `Product ${pid} added successfully to cart #${cid}`,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
