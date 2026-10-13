import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { checkDatabaseConnection } from './db.js';
import todoRoutes from './todoRoutes.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', async (_req, res) => {
  await checkDatabaseConnection();
  res.json({ status: 'ok', message: 'API và MySQL đang hoạt động.' });
});

app.use('/api/todos', todoRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Không tìm thấy đường dẫn API.' }));

app.use((error, _req, res, _next) => {
  console.error(error);
  const isDatabaseError = typeof error.code === 'string'
    && (error.code.startsWith('ER_') || error.code === 'ECONNREFUSED');
  res.status(500).json({
    message: isDatabaseError
      ? 'Không thể kết nối hoặc truy vấn MySQL. Hãy kiểm tra file .env và database.'
      : 'Máy chủ gặp lỗi. Vui lòng thử lại.',
  });
});

app.listen(port, () => console.log(`Todo API đang chạy tại http://localhost:${port}`));
