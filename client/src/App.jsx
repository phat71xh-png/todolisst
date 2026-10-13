import { useEffect, useMemo, useState } from 'react';
import { todoApi } from './api.js';
import CompletionCelebration from './components/CompletionCelebration.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import Pagination from './components/Pagination.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoHeader from './components/TodoHeader.jsx';
import TodoList from './components/TodoList.jsx';
import TodoToolbar from './components/TodoToolbar.jsx';
import { sortTodos } from './utils/sortTodos.js';

const ITEMS_PER_PAGE = 5;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dueSoon');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [now, setNow] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [celebration, setCelebration] = useState(null);

  useEffect(() => { loadTodos(); }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!celebration) return undefined;

    const timer = window.setTimeout(() => setCelebration(null), 3_000);
    return () => window.clearTimeout(timer);
  }, [celebration]);

  async function loadTodos() {
    try {
      setLoading(true);
      setError('');
      setTodos(await todoApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;

    try {
      setSaving(true);
      setError('');
      const newTodo = await todoApi.create(value, dueDate);
      setTodos((current) => [newTodo, ...current]);
      setTitle('');
      setDueDate('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateTodo(todo, values) {
    try {
      setError('');
      const updated = await todoApi.update(todo.id, values);
      setTodos((current) => current.map((item) => item.id === todo.id ? updated : item));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function toggleTodo(todo) {
    const isCompleting = !todo.completed;
    const saved = await updateTodo(todo, {
      title: todo.title,
      completed: isCompleting,
      due_date: todo.due_date,
    });

    if (saved && isCompleting) {
      const hasUnfinishedTodo = todos.some(
        (item) => item.id !== todo.id && !item.completed,
      );

      setCelebration({
        id: Date.now(),
        title: todo.title,
        allCompleted: !hasUnfinishedTodo,
      });
    }
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  async function saveEdit(todo) {
    const value = editingTitle.trim();
    if (!value) return;

    const saved = await updateTodo(todo, {
      title: value,
      completed: todo.completed,
      due_date: todo.due_date,
    });
    if (saved) setEditingId(null);
  }

  async function deleteTodo(id) {
    if (!window.confirm('Bạn có chắc muốn xóa công việc này?')) return;

    try {
      setError('');
      await todoApi.remove(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleTodos = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filteredTodos = todos.filter((todo) => {
      const matchesFilter = filter === 'all'
        || (filter === 'completed' && todo.completed)
        || (filter === 'active' && !todo.completed);
      return matchesFilter && todo.title.toLowerCase().includes(keyword);
    });

    return sortTodos(filteredTodos, sortBy);
  }, [todos, filter, search, sortBy]);

  const totalPages = Math.ceil(visibleTodos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTodos = visibleTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const completedCount = todos.filter((todo) => todo.completed).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, sortBy]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  return (
    <main className="page-shell">
      {celebration && (
        <CompletionCelebration
          key={celebration.id}
          title={celebration.title}
          allCompleted={celebration.allCompleted}
        />
      )}
      <section className="todo-card">
        <TodoHeader />
        <TodoForm
          title={title}
          dueDate={dueDate}
          saving={saving}
          onTitleChange={setTitle}
          onDueDateChange={setDueDate}
          onSubmit={addTodo}
        />
        <TodoToolbar
          filter={filter}
          search={search}
          sortBy={sortBy}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
        />
        <ErrorMessage message={error} onRetry={loadTodos} />

        {loading ? (
          <p className="empty-state">Đang tải danh sách…</p>
        ) : visibleTodos.length === 0 ? (
          <p className="empty-state">
            {todos.length === 0
              ? 'Chưa có công việc nào. Hãy thêm việc đầu tiên!'
              : 'Không tìm thấy công việc phù hợp.'}
          </p>
        ) : (
          <>
            <TodoList
              todos={paginatedTodos}
              now={now}
              editingId={editingId}
              editingTitle={editingTitle}
              onToggle={toggleTodo}
              onStartEditing={startEditing}
              onEditingTitleChange={setEditingTitle}
              onSaveEdit={saveEdit}
              onCancelEdit={() => setEditingId(null)}
              onDelete={deleteTodo}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <footer>
          <span>{todos.length - completedCount} việc chưa xong</span>
          <span>{completedCount}/{todos.length} đã hoàn thành</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
