import cors from 'cors';
import express from 'express';
import { checkDatabaseConnection, ensureSchema } from './db.js';
import todoRoutes from './todoRoutes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

app.use('/api', async (_req, _res, next) => {
  try {
    await ensureSchema();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', async (_req, res) => {
  await checkDatabaseConnection();
  res.json({ status: 'ok', message: 'API và PostgreSQL đang hoạt động.' });
});

app.use('/api/todos', todoRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Không tìm thấy đường dẫn API.' }));

app.use((error, _req, res, _next) => {
  console.error(error);
  const isDatabaseError = typeof error.code === 'string'
    && (error.code.length === 5 || error.code === 'ECONNREFUSED');
  res.status(500).json({
    message: isDatabaseError
      ? 'Không thể kết nối hoặc truy vấn PostgreSQL. Hãy kiểm tra DATABASE_URL.'
      : 'Máy chủ gặp lỗi. Vui lòng thử lại.',
  });
});

export default app;
