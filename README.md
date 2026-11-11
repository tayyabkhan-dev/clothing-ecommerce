# Men's Clothing E-Commerce Platform

A full-stack MERN e-commerce web application for a men's clothing store. The platform provides customers with product browsing, authentication, shopping cart, checkout, and order management, along with an admin dashboard for managing products and orders.

## Live Demo

- **Website:** https://clothing-ecommerce-eta-smoky.vercel.app/
- **Backend API:** https://clothing-ecommerce-production-48d92b69.up.railway.app/
- **GitHub Repository:** https://github.com/tayyabkhan-dev/clothing-ecommerce

## Features

### Customer Features
- Browse available clothing products.
- View individual product details.
- Register and log in to an account.
- Manage customer account information.
- Add products to the shopping cart.
- Proceed through the checkout process.
- Place orders as a guest or logged-in customer.
- View personal order history.
- View individual order details.
- Cancel eligible orders.

### Admin Features
- Protected admin dashboard.
- Manage clothing products.
- Create new products.
- Update existing products.
- Delete products.
- View customer orders.
- View individual order details.
- Update order statuses.

### Backend Features
- RESTful API architecture.
- JWT-based authentication.
- Password hashing using bcryptjs.
- Role-based admin authorization.
- MongoDB database integration.
- Protected API routes.
- Guest and authenticated customer order support.

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- JavaScript
- CSS
- Lucide React

### Backend
- Node.js
- Express.js 5
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

## Project Structure

```text
ecommerce/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/tayyabkhan-dev/clothing-ecommerce.git
```

### 2. Open the Project

```bash
cd clothing-ecommerce
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Backend Environment Variables

Create a `.env` file inside the `server` folder.

Add the following variables:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_secure_admin_password
```

Replace the placeholder values with your own credentials.

**Important:** Never upload your `.env` file, database credentials, JWT secret, or admin password to GitHub.

### 5. Start the Backend Server

From the `server` directory, run:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 6. Install Frontend Dependencies

Open a second terminal at the project root and run:

```bash
cd client
npm install
```

### 7. Configure Frontend Environment Variables

Create a `.env.development.local` file inside the `client` folder.

Add:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production deployment, configure the following environment variable in Vercel:

```env
VITE_API_BASE_URL=https://clothing-ecommerce-production-48d92b69.up.railway.app
```

### 8. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local development URL provided by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

Base URL:

```text
/api
```

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new customer |
| POST | `/api/auth/login` | Customer login |
| GET | `/api/auth/me` | Get current authenticated user |

### Product Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PATCH | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Order Routes

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Guest / Customer |
| GET | `/api/orders/my-orders` | Authenticated Customer |
| GET | `/api/orders/my-orders/:id` | Authenticated Customer |
| PATCH | `/api/orders/my-orders/:id/cancel` | Authenticated Customer |
| GET | `/api/orders` | Admin |
| GET | `/api/orders/:id` | Admin |
| PATCH | `/api/orders/:id/status` | Admin |

Admin routes require authentication and admin authorization.

## Database Models

The application uses MongoDB with Mongoose.

Main database models:

- **User:** Stores customer and admin account information.
- **Product:** Stores clothing product information.
- **Order:** Stores customer order information.

## Deployment

The application is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Railway |
| Database | MongoDB Atlas |

The frontend communicates with the deployed backend through the `VITE_API_BASE_URL` environment variable.

## Future Improvements

Potential improvements for future development:

- Online payment gateway integration.
- Product search and advanced filtering.
- Product reviews and ratings.
- Wishlist functionality.
- Improved inventory management.
- Email notifications for orders.
- Enhanced analytics for the admin dashboard.

## Author

**Tayyab Khan**

BS Computer Science — Major in Artificial Intelligence

GitHub: https://github.com/tayyabkhan-dev

---

*This project was developed as a full-stack MERN e-commerce application to demonstrate practical frontend, backend, database, authentication, and deployment skills.*