import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ListIndex from './index.page';
import { listSlice } from '@/store/list';
import { taskSlice } from '@/store/task';
import { authSlice } from '@/store/auth';
import modalReducer from '@/store/modalSlice';

// モックデータ
const mockLists = [
  {
    id: 'list-1',
    title: 'Test List',
  },
];

const mockTasks = [
  {
    id: 'task-1',
    title: 'Test Task',
    detail: 'Test Detail',
    done: false,
    limit: '2024-12-31T23:59:00',
  },
];

// モックストア作成ヘルパー
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      list: listSlice.reducer,
      task: taskSlice.reducer,
      modal: modalReducer,
    },
    preloadedState: {
      auth: { isAuthenticated: true, user: null },
      list: {
        lists: mockLists,
        current: 'list-1',
        isLoading: false,
        ...initialState.list,
      },
      task: {
        tasks: mockTasks,
        isLoading: false,
        ...initialState.task,
      },
      modal: {
        isOpen: false,
        type: null,
        data: null,
        ...initialState.modal,
      },
    },
  });
};

// React Router のモック
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ listId: 'list-1' }),
  };
});

describe('ListIndex 統合テスト', () => {
  let store;

  beforeEach(() => {
    store = createMockStore();
  });

  const renderListIndex = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ListIndex />
        </BrowserRouter>
      </Provider>
    );
  };

  it('リスト名とタスクが正しく表示される', () => {
    renderListIndex();

    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Detail')).toBeInTheDocument();
  });

  it('Edit...ボタンをクリックするとモーダルが開く', async () => {
    renderListIndex();

    const editButton = screen.getByText('Edit...');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit List')).toBeInTheDocument();
    });
  });

  it('タスクの編集ボタンをクリックするとタスク編集モーダルが開く', async () => {
    renderListIndex();

    const editTaskButton = screen.getByLabelText('Edit');
    fireEvent.click(editTaskButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });
  });

  it('不完了タスクの数が正しく表示される', () => {
    renderListIndex();

    // 不完了タスクが1つあるので、1が表示される
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('完了タスクのみの場合は数が表示されない', () => {
    const completedTasksOnly = [
      {
        id: 'task-1',
        title: 'Completed Task',
        detail: 'Test Detail',
        done: true,
        limit: '2024-12-31T23:59:00',
      },
    ];

    store = createMockStore({
      task: { tasks: completedTasksOnly, isLoading: false },
    });

    renderListIndex();

    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('タスクがない場合は「No tasks yet!」が表示される', () => {
    store = createMockStore({
      task: { tasks: [], isLoading: false },
    });

    renderListIndex();

    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
  });

  it('ローディング中は空のdivが表示される', () => {
    store = createMockStore({
      task: { tasks: [], isLoading: true },
    });

    const { container } = renderListIndex();

    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
