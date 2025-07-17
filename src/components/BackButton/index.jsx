import {ChevronIcon} from '@/icons/ChevronIcon';
import './index.css';

const handleClick = () => {
  window.history.back();
};

function BackButton() {
  return (
    <button type='button' onClick={handleClick} className='back_button'>
      <ChevronIcon className='back_button__icon' />
      Back
    </button>
  );
}

export default BackButton;
