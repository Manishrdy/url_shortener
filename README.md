# URL Shortener API

This is the backend API for a URL shortener application built with **Node.js, Express, and MongoDB**.  
It allows users to register, log in, and create shortened URLs with optional custom aliases.

---

## 📜 Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)

---

## ✨ Features
- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).  
- **URL Shortening**: Creates a unique, short ID for any given long URL.  
- **Custom Aliases**: Users can provide their own custom alias for a shortened URL, which takes precedence over the generated short ID.  
- **Redirection**: A public-facing endpoint to redirect short URLs to their original destination.  
- **Error Handling**: Global error handling middleware to ensure consistent error responses.  
- **Database Integration**: Uses Mongoose to model and interact with a MongoDB database.  

---

## 💻 Technologies Used
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose  
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs` for password hashing  
- **ID Generation**: `nanoid` for creating unique short IDs  
- **Development**: `nodemon` for automatic server restarts, `dotenv` for environment variable management  
- **Containerization**: Docker (via `docker-compose.yml`) for running the MongoDB instance  

---

## 🚀 API Endpoints

All API routes are prefixed with `/api`.

### Authentication
#### `POST /api/auth/register`
Registers a new user.  

**Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "Test User"
}
