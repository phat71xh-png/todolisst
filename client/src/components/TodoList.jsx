import TodoItem from './TodoItem.jsx';

function TodoList({
  todos,
  now,
  editingId,
  editingTitle,
  onToggle,
  onStartEditing,
  onEditingTitleChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          now={now}
          isEditing={editingId === todo.id}
          editingTitle={editingTitle}
          onToggle={onToggle}
          onStartEditing={onStartEditing}
          onEditingTitleChange={onEditingTitleChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
