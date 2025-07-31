import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/modalSlice';
import { ModalOverlay } from './ModalOverlay';
import { ModalContent } from './ModalContent';
import { ModalHeader } from './ModalHeader';
import './index.css';

function Modal({ children, title, onClose }) {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.modal);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
    dispatch(closeModal());
  }, [onClose, dispatch]);

  // モーダルが開いた時の処理
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;

      // フォーカス可能な要素を取得
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // モーダルが閉じた時の処理
  useEffect(() => {
    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleClose]);

  // フォーカストラップ機能
  useEffect(() => {
    const handleTabKey = (event) => {
      if (!isOpen || event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab の場合
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab の場合
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className='modal' role='dialog' aria-modal='true' aria-labelledby='modal-title'>
      <ModalOverlay onClick={handleClose} />
      <ModalContent ref={modalRef}>
        <ModalHeader title={title} onClose={handleClose} />
        {children}
      </ModalContent>
    </div>,
    document.body
  );
}

export default Modal;
