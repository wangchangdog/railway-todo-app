import { Link } from 'react-router-dom';
import './index.css';

export const FormActions = ({
  cancelLink,
  cancelText = 'Cancel',
  submitText,
  isSubmitting = false,
  deleteButton = null,
  onCancel,
  className = 'form_actions',
  spacerClassName = 'form_actions_spacer',
}) => {
  return (
    <div className={className}>
      {cancelLink ? (
        <Link to={cancelLink} data-variant='secondary' className='app_button'>
          {cancelText}
        </Link>
      ) : onCancel ? (
        <button
          type='button'
          data-variant='secondary'
          className='app_button'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </button>
      ) : null}
      <div className={spacerClassName} />
      {deleteButton}
      <button type='submit' className='app_button' disabled={isSubmitting}>
        {submitText}
      </button>
    </div>
  );
};
