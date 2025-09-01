MovieFlix - A Modern Movie Review Platform

MovieFlix is a feature-rich, full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) and PostgreSQL that allows users to discover, review, and discuss their favorite films. It provides a seamless and interactive experience for movie enthusiasts to engage with a community of like-minded individuals.

🚀 Features

🔐 User Authentication – Secure registration and login using JWT (stateless authentication).

🎞 Dynamic Movie Catalog – Browse, search, and filter movies fetched from the OMDB API.

📖 Detailed Movie Information – View synopsis, director, genre, and ratings.

📝 User Reviews & Ratings – Authenticated users can post, read, and rate reviews.

🎯 Personalized Watchlist – Add or remove movies with one click.

🛠 Admin Dashboard – Protected area for admins to manage users & content.

📱 Responsive Design – Mobile-first UI, works seamlessly across all devices.

🛠 Tech Stack
Backend

Node.js – JavaScript runtime

Express – Fast, minimalist web framework

PostgreSQL – Robust relational database

bcryptjs – Password hashing

jsonwebtoken (JWT) – Authentication

cors – Cross-Origin Resource Sharing

dotenv – Environment variable management

express-validator – Request data validation

Frontend

React – UI library

Vite – Next-gen frontend tooling

TypeScript – Statically typed JS

React Router – Declarative routing

Axios – HTTP client

CSS Modules – Scoped styling

⚙️ Getting Started
Prerequisites

Node.js (v14 or later)

npm (v6 or later)

PostgreSQL

Installation
1️⃣ Clone the repo:
git clone https://github.com/your_username/Movie-Review-Platform.git
cd Movie-Review-Platform

2️⃣ Backend Setup
cd server
npm install


Create a .env file inside server/:

PORT=5001
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
JWT_SECRET="your_jwt_secret"
OMDB_API_KEY="your_omdb_api_key"


Setup database tables:

npm run db:setup


Start backend server:

npm run dev

3️⃣ Frontend Setup
cd ../client
npm install
npm run dev

📡 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Log in an existing user
GET	/api/auth/me	Get current user's profile
GET	/api/movies	Get all movies
GET	/api/movies/:id	Get single movie details
POST	/api/movies/:id/reviews	Add a review
GET	/api/watchlist	Get user's watchlist
POST	/api/watchlist/:movieId	Add movie to watchlist
DELETE	/api/watchlist/:movieId	Remove movie from watchlist
GET	/api/users/me/reviews	Get all reviews by current user
GET	/api/users (Admin)	Get all users
DELETE	/api/users/:id (Admin)	Delete user by ID
📂 Project Structure
MovieFlix/
├── client/          # Frontend (React + Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .gitignore
│   ├── index.html
│   └── package.json
└── server/          # Backend (Node.js + Express + PostgreSQL)
    ├── src/
    │   ├── controllers/
    │   ├── db/
    │   ├── middleware/
    │   ├── routes/
    │   └── index.ts
    ├── .env
    ├── .gitignore
    └── package.json
