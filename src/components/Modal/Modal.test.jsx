import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Modal from './index';
import modalReducer from '@/store/modalSlice';

// モックストア作成ヘルパー
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      modal: modalReducer,
    },
    preloadedState: {
      modal: {
        isOpen: false,
        type: null,
        data: null,
        ...initialState,
      },
    },
  });
};

describe('Modal コンポーネント', () => {
  let store;
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = vi.fn();
    store = createMockStore({ isOpen: true });
  });

  const renderModal = (props = {}) => {
    return render(
      <Provider store={store}>
        <Modal title='Test Modal' onClose={mockOnClose} {...props}>
          <div>Modal Content</div>
        </Modal>
      </Provider>
    );
  };

  it('モーダルが開いている時に表示される', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('モーダルが閉じている時に表示されない', () => {
    store = createMockStore({ isOpen: false });
    renderModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('タイトルが正しく表示される', () => {
    renderModal();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toHaveAttribute('id', 'modal-title');
  });

  it('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
    renderModal();
    const closeButton = screen.getByLabelText('モーダルを閉じる');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('Escキーを押すとモーダルが閉じる', () => {
    renderModal();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('aria-modal属性が設定されている', () => {
    renderModal();
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  it('aria-labelledby属性が設定されている', () => {
    renderModal();
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('フォーカス可能な要素が存在する場合、最初の要素にフォーカスが移る', async () => {
    renderModal({
      children: (
        <div>
          <button>First Button</button>
          <button>Second Button</button>
        </div>
      ),
    });

    await waitFor(() => {
      expect(screen.getByText('First Button')).toHaveFocus();
    });
  });

  it('Tab キーでフォーカスが循環する', async () => {
    renderModal({
      children: (
        <div>
          <button>First Button</button>
          <button>Second Button</button>
        </div>
      ),
    });

    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');
    const closeButton = screen.getByLabelText('モーダルを閉じる');

    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });

    // Tab キーを押して次の要素にフォーカス
    fireEvent.keyDown(document, { key: 'Tab' });
    await waitFor(() => {
      expect(secondButton).toHaveFocus();
    });

    // Tab キーを押して閉じるボタンにフォーカス
    fireEvent.keyDown(document, { key: 'Tab' });
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    // 最後の要素からTab キーを押すと最初の要素にフォーカスが戻る
    fireEvent.keyDown(document, { key: 'Tab' });
    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });
  });

  it('Shift+Tab キーで逆方向にフォーカスが循環する', async () => {
    renderModal({
      children: (
        <div>
          <button>First Button</button>
          <button>Second Button</button>
        </div>
      ),
    });

    const firstButton = screen.getByText('First Button');
    const closeButton = screen.getByLabelText('モーダルを閉じる');

    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });

    // 最初の要素からShift+Tab キーを押すと最後の要素にフォーカス
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it('オーバーレイクリックでモーダルが閉じる', () => {
    renderModal();
    const overlay = document.querySelector('.modal__overlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('モーダルコンテンツクリックでモーダルが閉じない', () => {
    renderModal();
    const content = screen.getByText('Modal Content');
    fireEvent.click(content);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
