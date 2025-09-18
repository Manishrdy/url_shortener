# URL Shortener API

This is the backend API for a URL shortener application built with **Node.js**, **Express**, and **MongoDB**. It allows users to register, log in, and create shortened URLs with optional custom aliases.

---

## 📜 Table of Contents
- [✨ Features](#-features)
- [💻 Technologies Used](#-technologies-used)
- [🚀 API Endpoints](#-api-endpoints)
  - [Authentication](#authentication)
  - [URL Management](#url-management)
  - [Public Redirect](#public-redirect)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Running the Application](#running-the-application)
- [🔑 Environment Variables](#-environment-variables)
- [📂 Project Structure](#-project-structure)

---

## ✨ Features
- **User Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
- **URL Shortening:** Creates a unique, short ID for any given long URL.
- **Custom Aliases:** Users can provide their own custom alias for a shortened URL, which takes precedence over the generated short ID.
- **Redirection:** A public-facing endpoint to redirect short URLs to their original destination.
- **Error Handling:** Global error handling middleware to ensure consistent error responses.
- **Database Integration:** Uses Mongoose to model and interact with a MongoDB database.

---

## 💻 Technologies Used
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` for password hashing  
- **ID Generation:** `nanoid` for creating unique short IDs  
- **Development:** `nodemon` for automatic server restarts, `dotenv` for environment variable management  
- **Containerization:** Docker (via `docker-compose.yml`) for running the MongoDB instance

---

## 🚀 API Endpoints
_All API routes are prefixed with `/api`._

### Authentication

#### **POST** `/api/auth/register`
**Description:** Registers a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "Test User"
}
```

**Response:** Returns user data and a JWT token.

---

#### **POST** `/api/auth/login`
**Description:** Logs in an existing user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:** Returns user data and a JWT token.

---

### URL Management

#### **POST** `/api/urls`
**Description:** Creates a new shortened URL. This is a protected route and requires authentication.

**Headers:**  
`Authorization: Bearer <YOUR_JWT_TOKEN>`

**Body:**
```json
{
  "originalUrl": "https://www.google.com/very/long/url/to/shorten",
  "customAlias": "my-custom-link"
}
```
> `customAlias` is optional.

**Response:** Returns details of the created short URL.

---

### Public Redirect

#### **GET** `/:key`
**Description:** Redirects to the original URL associated with the key (which can be either a `shortId` or a `customAlias`).

**Example:**  
If your server is running on `localhost:3000`, a request to  
`http://localhost:3000/my-custom-link`  
will redirect to the corresponding long URL.

---

## 🏁 Getting Started
Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- Node.js (**v16 or higher recommended**)
- npm
- Docker and Docker Compose (for running the MongoDB database)

### Installation & Setup

**Clone the repository:**
```bash
git clone <your-repository-url>
cd url_shortener
```

**Install dependencies:**
```bash
npm install
```

**Create an environment file:**  
Create a `.env` file in the root of the project and add the environment variables listed below.

**Start the MongoDB database:**  
Use the provided `docker-compose.yml` file to start a MongoDB container.
```bash
docker-compose up -d
```

### Running the Application

**Development Mode:**  
Run the server with `nodemon` for automatic restarts on file changes:
```bash
npm run dev
```

**Production Mode:**  
Run the server in a production-like environment:
```bash
npm start
```

The server will be running at `http://localhost:3000` (or the port specified in your `.env` file).

---

## 🔑 Environment Variables
Create a `.env` file in the project's root directory and add the following variables:

```bash
# The port for the server to run on
PORT=3000

# Your MongoDB connection string.
# If using the provided docker-compose file, this will work.
MONGO_URI=mongodb://localhost:27017/urlshortener

# A secret key for signing JSON Web Tokens
JWT_SECRET=your_super_secret_key

# The expiration time for JWTs (e.g., 1h, 7d)
JWT_EXPIRES_IN=7d

# The base URL for constructing short URLs in the API response
# (e.g., http://localhost:3000 or your production domain)
BASE_URL=http://localhost:3000
```

---

## 📂 Project Structure
```
url_shortener/
├── config/
│   └── db.js               # Database connection logic
├── controllers/
│   ├── authController.js     # Logic for user registration and login
│   ├── redirectController.js # Logic for handling URL redirection
│   └── urlController.js      # Logic for creating short URLs
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── Url.js              # Mongoose model for URLs
│   └── User.js             # Mongoose model for Users
├── routes/
│   ├── auth.js             # Authentication routes
│   └── urls.js             # URL management routes
├── .env.example            # Example environment variables
├── .gitignore
├── docker-compose.yml      # Docker compose for MongoDB
├── package.json
├── package-lock.json
└── server.js               # Main application entry point
```
