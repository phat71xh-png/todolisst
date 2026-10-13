export function sortTodos(todos, sortBy) {
  return [...todos].sort((first, second) => {
    const firstCreatedAt = new Date(first.created_at).getTime();
    const secondCreatedAt = new Date(second.created_at).getTime();

    if (sortBy === 'newest') {
      return secondCreatedAt - firstCreatedAt;
    }

    if (sortBy === 'oldest') {
      return firstCreatedAt - secondCreatedAt;
    }

    if (first.completed !== second.completed) {
      return first.completed ? 1 : -1;
    }

    const firstHasDueDate = Boolean(first.due_date);
    const secondHasDueDate = Boolean(second.due_date);

    if (firstHasDueDate !== secondHasDueDate) {
      return firstHasDueDate ? -1 : 1;
    }

    if (firstHasDueDate && secondHasDueDate) {
      const dueDateDifference = new Date(first.due_date).getTime()
        - new Date(second.due_date).getTime();

      if (dueDateDifference !== 0) return dueDateDifference;
    }

    return secondCreatedAt - firstCreatedAt;
  });
}
