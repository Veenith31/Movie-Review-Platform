MovieFlix - A Modern Movie Review Platform
MovieFlix is a feature-rich, full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to discover, review, and discuss their favorite films. It provides a seamless and interactive experience for movie enthusiasts to engage with a community of like-minded individuals.


Features
User Authentication: Secure user registration and login system using JWT for stateless authentication.

Dynamic Movie Catalog: Browse, search, and filter a vast collection of movies fetched from the OMDB API.

Detailed Movie Information: View comprehensive details for each movie, including synopsis, director, genre, and ratings.

User Reviews and Ratings: Authenticated users can post, read, and rate movie reviews.

Personalized Watchlist: Curate a personal watchlist by adding or removing movies with a single click.

Admin Dashboard: A protected area for administrators to manage users and site content.

Responsive Design: A mobile-first, responsive user interface that works seamlessly across all devices.

Tech Stack
Backend
Node.js: JavaScript runtime for the server.

Express: Fast, unopinionated, minimalist web framework for Node.js.

PostgreSQL: Robust, open-source relational database.

bcryptjs: Library for hashing passwords.

jsonwebtoken (JWT): For implementing user authentication.

cors: For enabling Cross-Origin Resource Sharing.

dotenv: For managing environment variables.

express-validator: For request data validation.

Frontend
React: A JavaScript library for building user interfaces.

Vite: Next-generation front-end tooling for a faster and leaner development experience.

TypeScript: Statically typed superset of JavaScript.

React Router: For declarative routing in a React application.

Axios: Promise-based HTTP client for the browser and Node.js.

CSS Modules: For locally scoped CSS.

Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites: 

Node.js (v14 or later)

npm (v6 or later)

PostgreSQL

Installation

1. Clone the repo:
    git clone https://github.com/your_username/Movie-Review-Platform.git
    cd Movie-Review-Platform

2. Backend Setup
    cd server
    npm install

3.Create a .env file in the server directory and add the following environment variables:
PORT=5001
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
JWT_SECRET="your_jwt_secret"
OMDB_API_KEY="your_omdb_api_key"

Set up the database tables:
npm run db:setup

Start the backend server:
npm run dev

Frontend Setup
cd ../client
npm install

Start the frontend development server:
npm run dev

API Endpoints
The following are the available API endpoints:

Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	    Log in an existing user
GET	    /api/auth/me	    Get the current user's profile
GET	    /api/movies	        Get a list of all movies
GET	    /api/movies/:id	    Get details for a single movie
POST	/api/movies/:id/reviews	Add a review to a movie
GET	/   api/watchlist	Get the current user's watchlist
POST	/api/watchlist/:movieId	Add a movie to the watchlist
DELETE	/api/watchlist/:movieId	Remove a movie from the watchlist
GET	/api/users/me/reviews	Get all reviews by the current user
GET	/api/users	(Admin) Get a list of all users
DELETE	/api/users/:id	(Admin) Delete a user by ID

Project Structure
tmov/
├── client/         # Frontend React application
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
└── server/         # Backend Express application
    ├── src/
    │   ├── controllers/
    │   ├── db/
    │   ├── middleware/
    │   ├── routes/
    │   └── index.ts
    ├── .env
    ├── .gitignore
    └── package.json