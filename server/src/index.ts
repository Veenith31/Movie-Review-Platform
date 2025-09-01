import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db'; // Import the database pool

import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes'; 
import watchlistRoutes from './routes/watchlistRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

app.use('/api/movies', movieRoutes); // 👈 Use movie routes

app.use('/api/watchlist', watchlistRoutes);

app.use('/api/users', userRoutes); 

app.use('/api/admin', adminRoutes);

app.get('/api/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
  
  try {
    const client = await pool.connect();
    console.log(' Database connection successful');
    client.release();
  } catch (err) {
    console.error(' Failed to connect to the database', err);
  }
});