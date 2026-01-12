# 🛒 Cart NodeJS — RESTful Shopping Cart API

A powerful and easy-to-use **backend application** built with **Node.js, Express, and MongoDB** to manage products and shopping carts for e-commerce apps.

Designed with clean architecture and flexible APIs, this project makes it perfect for learning, extending, and integrating into full-stack applications.

## 🧩 Project Status
- ✅ Backend: fully functional (products, carts, users, auth, JWT, Swagger)
- 🚧 Frontend: currently implements user register, login and profile update. Checkout de frontend project [here](https://github.com/annalemonbcn/cart_nodeJs_front_ts)
- 📦 The backend is ready to support a full e-commerce frontend (catalog, cart, checkout, etc.)

## 🚀 Features

+ ✔ Fully RESTful API
+ ✔ Product and Cart management
+ ✔ Add/remove items from carts
+ ✔ Pagination and query filters for products
+ ✔ Database seeding scripts
+ ✔ Swagger API documentation
+ ✔ Ready for integration with front-ends or mobile apps

## 🧠 Built With

This project uses modern, widely-adopted technologies and tools:

- [Node.js](https://nodejs.org/) — JavaScript runtime
- [Express](https://expressjs.com/) — Lightweight web framework
- [MongoDB](https://www.mongodb.com/) — NoSQL database + ORM
- [Swagger](https://swagger.io/tools/swagger-ui/) — Auto-generated API docs
- [Nodemon](https://github.com/remy/nodemon) — Live reload during development
- [Faker](https://fakerjs.dev/) — Sample data generation

### 🔧 Additional Technologies Worth Highlighting

Besides Node, Express and MongoDB, this project also uses:

- JWT (JSON Web Tokens) — Authentication & protected routes
- bcrypt — Secure password hashing
- dotenv — Environment configuration
- Express Router — Modular routing architecture
- Middleware architecture — Auth, error handling, validations
- MVC-ish structure — Controllers, services, models, routes separation

## 📦 Installation

Get started locally in just a few steps:

```bash
# Clone the repository
git clone https://github.com/annalemonbcn/cart_nodeJs.git
cd cart_nodeJs

# Install dependencies
npm install
```

## ⚙️ Configuration

Create a `.env` file in the project root directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
```

- Replace `your_mongodb_connection_string` with your actual MongoDB URI (local or remote).
- `PORT` is the port your Express server will run on (default: 8080).

## 📂 Project Structure

```bash
/
├── src/
│   ├── controllers/      # Route handlers
│   ├── db/
│   │   ├── config/        # DB setup
│   │   ├── models/        # Mongoose schemas
│   │   └── seeders/       # Sample data scripts
│   ├── helpers/           # Utility services
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Helper utilities
│   └── app.js             # Entry point
├── .env                   # Environment variables
├── package.json
└── swagger.yaml           # API specification
```

## 🌱 Database Seeding

You can populate the database with sample products using the following command:

```bash
# Generate sample products
node src/db/seeders/products.js

# Generate sample carts
node src/db/seeders/carts.js
```

## 🧭 API Endpoints

### 🛒 Cart Routes
| Method | Endpoint | Description |
| ------------- | ------------- | ------------- |
| GET  | `/api/carts` | Get all carts |
| GET  | `/api/carts/:id` | Get a single cart by ID |
| POST  | `/api/carts` | Create a new cart |
| PUT  | `/api/carts/:id` | Update an existing cart |
| DELETE  | `/api/carts/:id` | Remove a cart |
| POST  | `/api/carts/:id/products` | Add product to cart |
| DELETE  | `/api/carts/:id/products/:prodId` | Remove product from cart |

### 🛍️ Product Routes
| Method | Endpoint | Description |
| ------------- | ------------- | ------------- |
| GET  | `/api/products` | List products (pagination/filters) |
| GET  | `/api/products/:id` | Get product details |
| POST  | `/api/products` | Create a product |
| PUT  | `/api/products/:id` | Update product |
| DELETE  | `/api/products/:id` | Remove product |

### 👤 User Routes
> These are especially important since the frontend already uses them.
| Method | Endpoint | Description |
| ------------- | ------------- | ------------- |
| GET  | `/api/users` | Get all users |
| GET  | `/api/users/:id` | Get user by ID |
| POST  | `/api/users` | Create a new user |
| PUT  | `/api/users/:id` | Update user data |
| DELETE  | `/api/users/:id` | Delete user |

### 🔐 Auth Routes
> These power register, login and session authentication in the frontend.
| Method | Endpoint | Description |
| ------------- | ------------- | ------------- |
| POST  | `/api/auth/register` | Register new user |
| POST  | `/api/auth/login` | Login and get JWT token |
| GET  | `/api/auth/me` | Get current authenticated user |

## 📚 API Documentation

Interactive API documentation is available at:

```
http://localhost:8080/api-docs
```

Explore every endpoint with live examples and try requests directly from your browser.

You can also access it online at:

```
https://cartnodejs-prod.up.railway.app/api-docs
```

## 🌐 Live API

The backend is deployed on [Railway](https://railway.app/):

👉 **[https://cartnodejs-production.up.railway.app/](https://cartnodejs-production.up.railway.app/)**  
Use this base URL to test endpoints.

Example:  
`GET https://cartnodejs-production.up.railway.app/api/products`

## 🤝 Acknowledgements

Built by Anna Esteve aka annalemonbcn— showcase of API design and Node.js skill.
