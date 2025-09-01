import { Router } from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlistControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All routes in this file are protected by the auth middleware
router.use(authMiddleware);

router.get('/', getWatchlist);
router.post('/:movieId', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);

export default router;