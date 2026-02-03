import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
