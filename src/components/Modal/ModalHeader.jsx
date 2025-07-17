
export function ModalHeader({ title, onClose }) {
  return (
    <div className='modal__header'>
      <h2 id='modal-title' className='modal__title'>
        {title}
      </h2>
      <button
        type='button'
        className='modal__close'
        onClick={onClose}
        aria-label='モーダルを閉じる'
      >
        ×
      </button>
    </div>
  );
}
