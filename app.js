const express = require("express");
const { default: routes } = require("./router");

const app = express();

const PORT = 8080;

app.use(express.json());

const { cartsRoute, productsRoute } = routes;

// API: products
app.get(productsRoute, (req, res) => {});

app.get(`${productsRoute}/:pid`, (req, res) => {});

app.post(productsRoute, (req, res) => {});

app.put(`${productsRoute}/:pid`, (req, res) => {});

app.delete(`${productsRoute}/:pid`, (req, res) => {});

// API: carts
app.post(cartsRoute, (req, res) => {});

app.get(`${cartsRoute}/:cid`, (req, res) => {});

app.post(`${cartsRoute}/:cid/product/:pid`, (req, res) => {});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
