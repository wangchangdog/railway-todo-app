import { describe, it, expect } from 'vitest';
import modalReducer, { openModal, closeModal } from './modalSlice';

describe('modalSlice', () => {
  const initialState = {
    isOpen: false,
    type: null,
    data: null,
  };

  it('初期状態が正しい', () => {
    expect(modalReducer(undefined, {})).toEqual(initialState);
  });

  describe('openModal', () => {
    it('typeのみでモーダルを開く', () => {
      const action = openModal({ type: 'list-edit' });
      const result = modalReducer(initialState, action);

      expect(result).toEqual({
        isOpen: true,
        type: 'list-edit',
        data: null,
      });
    });

    it('typeとdataでモーダルを開く', () => {
      const action = openModal({
        type: 'task-edit',
        data: { listId: '1', taskId: '2' },
      });
      const result = modalReducer(initialState, action);

      expect(result).toEqual({
        isOpen: true,
        type: 'task-edit',
        data: { listId: '1', taskId: '2' },
      });
    });

    it('既に開いているモーダルの状態を更新する', () => {
      const openState = {
        isOpen: true,
        type: 'list-edit',
        data: { listId: '1' },
      };

      const action = openModal({
        type: 'task-edit',
        data: { listId: '1', taskId: '2' },
      });
      const result = modalReducer(openState, action);

      expect(result).toEqual({
        isOpen: true,
        type: 'task-edit',
        data: { listId: '1', taskId: '2' },
      });
    });
  });

  describe('closeModal', () => {
    it('モーダルを閉じる', () => {
      const openState = {
        isOpen: true,
        type: 'list-edit',
        data: { listId: '1' },
      };

      const action = closeModal();
      const result = modalReducer(openState, action);

      expect(result).toEqual({
        isOpen: false,
        type: null,
        data: null,
      });
    });

    it('既に閉じているモーダルの状態を処理する', () => {
      const action = closeModal();
      const result = modalReducer(initialState, action);

      expect(result).toEqual({
        isOpen: false,
        type: null,
        data: null,
      });
    });
  });
});
