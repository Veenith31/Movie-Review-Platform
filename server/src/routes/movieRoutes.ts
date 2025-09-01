import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllMovies, 
  getMovieById, 
  addReview, 
  importMovieFromOMDB 
} from '../controllers/movieController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllMovies);


router.get('/:id', getMovieById);


router.post(
  '/:id/reviews',
  [
    authMiddleware,
    body('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('review_text', 'Review text is required').not().isEmpty(),
  ],
  addReview
);


router.post('/import', authMiddleware, importMovieFromOMDB);

export default router;