import './DeleteButton.css';

export const DeleteButton = ({ 
  onDelete, 
  confirmMessage = 'Are you sure you want to delete this item?',
  disabled = false,
  children = 'Delete',
  className = 'app_button delete_button'
}) => {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onDelete();
    }
  };

  return (
    <button
      type='button'
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
