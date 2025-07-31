import { forwardRef } from 'react';

export const ModalContent = forwardRef(({ children }, ref) => {
  return (
    <div ref={ref} className='modal__content' onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
});

ModalContent.displayName = 'ModalContent';
