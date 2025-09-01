import { Router } from 'express';
import { deleteUserById, getAllUsers, getUserReviews } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/me/reviews', getUserReviews);

router.get('/', [authMiddleware, adminMiddleware], getAllUsers);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteUserById)

export default router;