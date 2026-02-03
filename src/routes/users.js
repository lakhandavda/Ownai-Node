import express from 'express';
import { AppDataSource } from '../data-source.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const q = req.query.q || '';
  const country = req.query.country || '';
  if (!req.user || req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const repo = AppDataSource.getRepository('User');
  let qb = repo.createQueryBuilder('user');
  if (q) qb = qb.andWhere('(user.name LIKE :q OR user.email LIKE :q)', { q: `%${q}%` });
  if (country) qb = qb.andWhere('user.country = :country', { country });
  const users = await qb.getMany();
  const safe = users.map(u => {
    const copy = Object.assign({}, u);
    delete copy.password;
    return copy;
  });
  res.json(safe);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const repo = AppDataSource.getRepository('User');
  const user = await repo.findOneBy({ id });
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'Admin' && req.user.id !== id) return res.status(403).json({ message: 'Forbidden' });
  const safe = Object.assign({}, user);
  delete safe.password;
  res.json(safe);
});

export default router;
