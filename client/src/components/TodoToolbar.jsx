const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Chưa xong' },
  { value: 'completed', label: 'Đã xong' },
];

function TodoToolbar({
  filter,
  search,
  sortBy,
  onFilterChange,
  onSearchChange,
  onSortChange,
}) {
  return (
    <div className="toolbar">
      <div className="filters" aria-label="Lọc công việc">
        {FILTERS.map((item) => (
          <button
            className={filter === item.value ? 'active' : ''}
            key={item.value}
            onClick={() => onFilterChange(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="toolbar-controls">
        <input
          className="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm kiếm…"
          aria-label="Tìm kiếm công việc"
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sắp xếp công việc"
        >
          <option value="dueSoon">Hạn gần nhất</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
    </div>
  );
}

export default TodoToolbar;
