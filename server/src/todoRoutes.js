import { Router } from 'express';
import { pool } from './db.js';

const router = Router();
const selectFields = 'id, title, completed, due_date, created_at, updated_at';

function normalizeTodo(row) {
  return { ...row, completed: Boolean(row.completed) };
}

router.get('/', async (_req, res) => {
  const [rows] = await pool.query(`SELECT ${selectFields} FROM todos ORDER BY created_at DESC`);
  res.json(rows.map(normalizeTodo));
});

router.post('/', async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (!title) return res.status(400).json({ message: 'Tên công việc không được để trống.' });
  if (title.length > 255) return res.status(400).json({ message: 'Tên công việc tối đa 255 ký tự.' });

  const dueDate = req.body.due_date ? new Date(req.body.due_date): null;
  if (dueDate && Number.isNaN(dueDate.getTime())) {
    return res.status(400).json({
      message: 'Thời hạn không hợp lệ.',
    });
  }

  const [result] = await pool.execute('INSERT INTO todos (title,due_date) VALUES (?,?)', [title, dueDate]);
  const [rows] = await pool.execute(`SELECT ${selectFields} FROM todos WHERE id = ?`, [result.insertId]);
  return res.status(201).json(normalizeTodo(rows[0]));
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  const { completed } = req.body;

  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'ID công việc không hợp lệ.' });
  if (!title || title.length > 255 || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Dữ liệu công việc không hợp lệ.' });
  }

  const dueDate = req.body.due_date ? new Date(req.body.due_date): null;
  if (dueDate && Number.isNaN(dueDate.getTime())) {
    return res.status(400).json({
      message: 'Thời hạn không hợp lệ.',
    });
  }

  const [result] = await pool.execute('UPDATE todos SET title = ?, completed = ?,due_date = ? WHERE id = ?', [title, completed,dueDate, id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy công việc.' });

  const [rows] = await pool.execute(`SELECT ${selectFields} FROM todos WHERE id = ?`, [id]);
  return res.json(normalizeTodo(rows[0]));
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'ID công việc không hợp lệ.' });

  const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy công việc.' });
  return res.status(204).send();
});

export default router;
