import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { AppDataSource } from '../data-source.js';

export async function authMiddleware(req, res, next) {
  const auth = req.headers && req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing authorization' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userRepo = AppDataSource.getRepository('User');
    const user = await userRepo.findOneBy({ id: payload.id });
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
