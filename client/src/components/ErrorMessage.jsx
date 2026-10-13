function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error" role="alert">
      {message}
      <button type="button" onClick={onRetry}>Thử lại</button>
    </div>
  );
}

export default ErrorMessage;
