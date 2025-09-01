import { Response } from 'express';
import pool from '../db';

export const getWatchlist = async (req: any, res: Response) => {
  try {
    const watchlist = await pool.query(
      `SELECT m.* FROM movies m
       JOIN watchlist w ON m.id = w.movie_id
       WHERE w.user_id = $1`,
      [req.user.id]
    );
    res.json(watchlist.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const addToWatchlist = async (req: any, res: Response) => {
  const { movieId } = req.params;
  try {
    const existing = await pool.query(
      'SELECT * FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [req.user.id, movieId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: 'Movie already in watchlist' });
    }

    await pool.query('INSERT INTO watchlist (user_id, movie_id) VALUES ($1, $2)', [
      req.user.id,
      movieId,
    ]);
    res.status(201).json({ msg: 'Movie added to watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const removeFromWatchlist = async (req: any, res: Response) => {
  const { movieId } = req.params;
  try {
    await pool.query('DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2', [
      req.user.id,
      movieId,
    ]);
    res.json({ msg: 'Movie removed from watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};