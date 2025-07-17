import './ErrorMessage.css';

export const ErrorMessage = ({ message, className = 'error_message' }) => {
  if (!message) return null;

  return <p className={className}>{message}</p>;
};
