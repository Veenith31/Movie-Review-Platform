import { Response } from 'express';
import pool from '../db';

export const getUserReviews = async (req: any, res: Response) => {
  try {
    const reviews = await pool.query(
      `SELECT r.rating, r.review_text, r.created_at, m.title, m.id as movie_id
       FROM reviews r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(reviews.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    // Exclude password hash for security
    const users = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    console.log('Database result for getAllUsers:', users.rows); 
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const deleteUserById = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const deleteResult = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};