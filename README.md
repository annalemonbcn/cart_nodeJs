# 🛒 Cart NodeJS

Backend for shopping cart management, built with **Node.js**, **Express**, **MongoDB** and **Mongoose**.

## 🚀 Table of Contents

1. [Description](#-description)
2. [Technologies](#-technologies)
3. [Startup](#-startup)
4. [Environment Variables](#-environment-variables)
5. [Project Structure](#-project-structure)
6. [Seeding](#-seeding)
7. [Endpoints](#-endpoints)
8. [Models](#-models)
9. [API Documentation](#-api-documentation)
10. [Live API](#-live-api)

---

## 📋 Description

This project provides a RESTful backend for managing a shopping cart. It allows you to **create and update products and carts**, as well as add or remove products from a cart.

---

## 🧰 Technologies

- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/) 
- [Mongoose](https://mongoosejs.com/)
- [Swagger](https://swagger.io/tools/swagger-ui/)
- [Nodemon](https://github.com/remy/nodemon) (for development)
- [Faker](https://fakerjs.dev/) (for development)

---

## 🔧 Startup

Clone the repository:

```bash
git clone https://github.com/annalemonbcn/cart_nodeJs.git
cd cart_nodeJs
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
```

- Replace `your_mongodb_connection_string` with your actual MongoDB URI (local or remote).
- `PORT` is the port your Express server will run on (default: 8080).

---

## 📂 Project Structure

```
/
├── src/
│   ├── controllers/    # Route logic
│   └── db/             
│       ├── config/     # Database config
│       ├── models/     # Mongoose schemas
│       └── seeders/    # Seeders to feed db
│   ├── helpers/        # Services utilities
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── utils/          # Utilities
│   └── app.js          # Main file
├── .env                # Environment variables
├── package.json
└── README.md
```

---

## 🌱 Seeding

You can populate the database with sample products using the following command:

```bash
node src/db/seeders/products.js
```

The same for carts:

```bash
node src/db/seeders/carts.js
```

---

## 🧭 Endpoints

### Carts (`/api/carts`)
- `GET /` – Get all carts
- `GET /:id` – Get cart by ID
- `POST /` – Create new cart
- `PUT /:id` – Update cart
- `DELETE /:id` – Delete cart
- `POST /:id/products` – Add product to cart
- `DELETE /:id/products/:prodId` – Remove product from cart

### Products (`/api/products`)
- `GET /` – Get all products (with pagination/query params)
- `GET /:id` – Get product by ID
- `POST /` – Create product
- `PUT /:id` – Update product
- `DELETE /:id` – Delete product

---

## 📦 Models

- **Product**  
  `title`, `description`, `price`, `stock`, `category`, etc.

- **Cart**  
  Array of products, having `{ product: ObjectId, quantity: Number }`.

---

## 📚 API Documentation

Interactive API documentation is available at:

```
http://localhost:8080/api-docs
```

It is automatically generated using **Swagger UI** and provides a complete overview of all available endpoints.

You can also access it online at:

```
https://cartnodejs-production.up.railway.app/api-docs
```

---

## 🌐 Live API

The backend is deployed on [Railway](https://railway.app/):

👉 **[https://cartnodejs-production.up.railway.app/](https://cartnodejs-production.up.railway.app/)**  
Use this base URL to test endpoints.

Example:  
`GET https://cartnodejs-production.up.railway.app/api/products`