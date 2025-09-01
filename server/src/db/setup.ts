import pool from './index';

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      profile_picture_url VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS movies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      genre VARCHAR(100),
      release_year INTEGER,
      director VARCHAR(255),
      synopsis TEXT,
      poster_url VARCHAR(255),
      average_rating NUMERIC(3, 2) DEFAULT 0.00
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review_text TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS watchlist (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
      added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, movie_id)
    );
  `;

  try {
    await pool.query(queryText);
    console.log(' Tables created successfully!');
  } catch (err) {
    console.error(' Error creating tables', err);
  } finally {
    await pool.end(); // Close the connection pool
  }
};

createTables();