import { formatDate, isOverdue } from '../utils/date.js';

function TodoItem({
  todo,
  now,
  isEditing,
  editingTitle,
  onToggle,
  onStartEditing,
  onEditingTitleChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  const overdue = isOverdue(todo, now);

  return (
    <li className={[todo.completed ? 'completed' : '', overdue ? 'overdue' : ''].join(' ')}>
      <input
        checked={Boolean(todo.completed)}
        onChange={() => onToggle(todo)}
        type="checkbox"
        aria-label={`Đánh dấu ${todo.title}`}
      />

      {isEditing ? (
        <form
          className="edit-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSaveEdit(todo);
          }}
        >
          <input
            autoFocus
            value={editingTitle}
            maxLength={255}
            onChange={(event) => onEditingTitleChange(event.target.value)}
          />
          <button type="submit">Lưu</button>
          <button type="button" onClick={onCancelEdit}>Hủy</button>
        </form>
      ) : (
        <>
          <div className="todo-content">
            <span className="todo-title">{todo.title}</span>
            <time className="todo-date" dateTime={todo.created_at}>
              Ngày tạo: {formatDate(todo.created_at)}
            </time>
            {todo.due_date && (
              <time className="todo-deadline" dateTime={todo.due_date}>
                Hạn hoàn thành: {formatDate(todo.due_date)}
              </time>
            )}
          </div>

          <div className="todo-right">
            {overdue && (
              <span className="overdue-message" role="status">Đã quá hạn</span>
            )}
            <div className="actions">
              <button type="button" onClick={() => onStartEditing(todo)}>Sửa</button>
              <button className="danger" type="button" onClick={() => onDelete(todo.id)}>Xóa</button>
            </div>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
