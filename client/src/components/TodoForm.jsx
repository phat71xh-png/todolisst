function TodoForm({ title, dueDate, saving, onTitleChange, onDueDateChange, onSubmit }) {
  return (
    <form className="add-form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        maxLength={255}
        placeholder="Bạn cần làm gì?"
        aria-label="Tên công việc mới"
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(event) => onDueDateChange(event.target.value)}
        aria-label="Thời hạn công việc"
      />
      <button disabled={saving || !title.trim()} type="submit">
        {saving ? 'Đang thêm…' : 'Thêm việc'}
      </button>
    </form>
  );
}

export default TodoForm;
