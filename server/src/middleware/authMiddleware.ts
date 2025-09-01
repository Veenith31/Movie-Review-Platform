import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get token from header
  const authHeader = req.header('Authorization');

  // 2. Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Verify token
    const token = authHeader.split(' ')[1]; // Get token from "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret') as { user: { id: string } };

    // 4. Add user from payload to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};