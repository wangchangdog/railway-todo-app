import './index.css';

function ErrorMessage({ message, className = 'error_message' }) {
  if (!message) return null;

  return <p className={className}>{message}</p>;
}

export default ErrorMessage;
