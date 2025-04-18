# 🛍️ E-commerce Website (MERN Stack)

This is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides users with a seamless shopping experience, including features like user authentication, product listing, cart functionality, and order processing.

## 📌 Features

### 👤 User Side:
- Register/Login with secure authentication (JWT)
- Browse products on the homepage
- Add products to cart

### 🛠️ Admin Side:
- Manage product listings
- View and manage customer orders

## 🧠 Tech Stack

| Layer       | Technology Used       |
|-------------|------------------------|
| Frontend    | React.js, HTML, CSS, JavaScript, Axios, React Context API |
| Backend     | Node.js, Express.js    |
| Database    | MongoDB (NoSQL)        |
| Authentication | JWT, bcrypt.js     |
| Tools       | GitHub, Postman, VS Code, npm |

## 📂 Project Structure

```
ecommerce-website-MERN/
│
├── backend/             # Node.js + Express backend
│   ├── models/          # MongoDB models (User, Product, Order)
│   ├── routes/          # API routes
│   └── index.js        # Server entry point
│
├── frontend/            # React frontend
│   ├── src/      # Reusable React components
│   ├── components/         # Main pages (Home, Login, Cart, etc.)
│   └── App.js           # App entry point
│
└── README.md            # Project documentation
```

## 🚀 Installation and Setup

### Clone the repository

```bash
git clone https://github.com/shilpan16/ecommerce-website-MERN.git
cd ecommerce-website-MERN
```

### Backend Setup

```bash
cd ecommerce-backend
npm install
npm start
```

### Frontend Setup

```bash
cd ecommerce-frontend
npm install
npm start
```

> Make sure MongoDB is running locally or update the MongoDB URI in `backend/config`.

## 📦 APIs Used

- `/api/users` – for login/register
- `/api/products` – for fetching product list
- `/api/orders` – for placing and managing orders

## 🎯 Project Purpose

This project was developed as part of a 6-week **Full Stack Web Development Internship** conducted by **Edunet Foundation**, in collaboration with **EY GDS** and **AICTE**. It aims to showcase practical full-stack development skills by building a real-world e-commerce solution.

## 📈 Future Enhancements

- Payment gateway integration (e.g., Stripe, Razorpay)
- Admin dashboard for product and order management
- Product search and filters
- Email notifications

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
