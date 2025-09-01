import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { Result } from 'pg';

const router = Router();


router.get('/stats', [authMiddleware, adminMiddleware], (req: Request, res: Response) => {
  res.json({
    users: 150, 
    movies: 2000,
    reviews: 5000,
  });
});

export default router;