export function formatDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function isOverdue(todo, now) {
  return Boolean(
    todo.due_date
      && !todo.completed
      && new Date(todo.due_date).getTime() < now,
  );
}
