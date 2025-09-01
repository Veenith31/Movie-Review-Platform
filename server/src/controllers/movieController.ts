import { Request, Response } from 'express';
import pool from '../db';
import { validationResult } from 'express-validator';
import axios from 'axios';


export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;

    let baseQuery = 'SELECT * FROM movies';
    const queryParams = [];

    if (search) {
      baseQuery += ' WHERE title ILIKE $1';
      queryParams.push(`%${search}%`);
    }
    baseQuery += ' ORDER BY release_year DESC';

    const localResults = await pool.query(baseQuery, queryParams);

    // If we find movies locally, return them immediately
    if (localResults.rows.length > 0) {
      return res.json(localResults.rows);
    }
    
    // If we are just browsing (no search term), and the DB is empty, return empty
    if (!search) {
        return res.json([]);
    }

    const apiKey = process.env.OMDB_API_KEY;
    const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(search)}&apikey=${apiKey}`);

    if (omdbResponse.data.Response === 'True') {
      const movieData = omdbResponse.data;

   
      const newMovie = await pool.query(
        `INSERT INTO movies (title, genre, release_year, director, synopsis, poster_url) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          movieData.Title,
          movieData.Genre,
          parseInt(movieData.Year),
          movieData.Director,
          movieData.Plot,
          movieData.Poster,
        ]
      );

      return res.json(newMovie.rows);
    }

    // If nothing was found locally or on OMDB, return an empty array
    res.json([]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get a single movie by its ID, including its reviews
export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Query for the movie details
    const movieRes = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    if (movieRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    const movie = movieRes.rows[0];

    // Query for the reviews for that movie
    const reviewsRes = await pool.query(
      `SELECT r.id, r.rating, r.review_text, r.created_at, u.username 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Combine the results
    const response = {
      ...movie,
      reviews: reviewsRes.rows,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const addReview = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const movieId = req.params.id;
  const userId = req.user.id; // From our authMiddleware
  const { rating, review_text } = req.body;

  try {
    // 1. Insert the new review
    const newReview = await pool.query(
      'INSERT INTO reviews (movie_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [movieId, userId, rating, review_text]
    );

    // 2. Recalculate the average rating for the movie
    await pool.query(
      `UPDATE movies SET average_rating = (
         SELECT AVG(rating) FROM reviews WHERE movie_id = $1
       ) WHERE id = $1`,
      [movieId]
    );

    res.status(201).json(newReview.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const importMovieFromOMDB = async (req: any, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ msg: 'Movie title is required' });
  }

  try {
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);

    if (response.data.Response === 'False') {
      return res.status(404).json({ msg: 'Movie not found on OMDB' });
    }

    const movieData = response.data;

    // Check if the movie already exists in our DB
    const existingMovie = await pool.query('SELECT * FROM movies WHERE title = $1', [movieData.Title]);
    if (existingMovie.rows.length > 0) {
      return res.status(400).json({ msg: 'Movie already exists in our database' });
    }

    // Save the movie to our database
    const newMovie = await pool.query(
      `INSERT INTO movies (title, genre, release_year, director, synopsis, poster_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        movieData.Title,
        movieData.Genre,
        parseInt(movieData.Year),
        movieData.Director,
        movieData.Plot,
        movieData.Poster,
      ]
    );

    res.status(201).json(newMovie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};