import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source.js';
import { runValidation } from '../validators.js';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository('User');
    const { name, email, password, role, phone, city, country } = req.body;
    const exists = await userRepo.findOneBy({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = { name, email, password, role, phone, city, country };
    await runValidation(user);
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    const saved = await userRepo.save(user);
    const safe = Object.assign({}, saved);
    delete safe.password;
    res.status(201).json(safe);
  } catch (err) {
    res.status(400).json({ message: (err && err.message) || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository('User');
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: (err && err.message) || 'Login failed' });
  }
});

export default router;
