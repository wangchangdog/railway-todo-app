import { TaskCreateForm } from '@/components/TaskCreateForm/index';
import { TaskItem } from '@/components/TaskItem/index';
import { setCurrentList } from '@/store/list';
import { fetchTasks } from '@/store/task';
import { openModal } from '@/store/modalSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditList from './edit/index.page';
import EditTask from './tasks/[taskId]/index.page';
import './index.css';

const ListIndex = () => {
  const dispatch = useDispatch();
  const { listId } = useParams();

  const isLoading = useSelector((state) => state.task.isLoading || state.list.isLoading);

  const tasks = useSelector((state) => state.task.tasks);
  const listName = useSelector((state) => {
    const currentId = state.list.current;
    const list = state.list.lists?.find((list) => list.id === currentId);
    return list?.title;
  });
  const incompleteTasksCount = useSelector((state) => {
    return state.task.tasks?.filter((task) => !task.done).length;
  });

  const modalState = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(setCurrentList(listId));
    dispatch(fetchTasks()).unwrap();
  }, [listId, dispatch]);

  const handleEditClick = () => {
    dispatch(openModal({ type: 'list-edit', data: { listId } }));
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className='tasks_list'>
      <div className='tasks_list__title'>
        {listName}
        {incompleteTasksCount > 0 && (
          <span className='tasks_list__title__count'>{incompleteTasksCount}</span>
        )}
        <div className='tasks_list__title_spacer'></div>
        <button className='app_button' onClick={handleEditClick}>
          Edit...
        </button>
      </div>
      <div className='tasks_list__items'>
        <TaskCreateForm />
        {tasks?.map((task) => {
          return <TaskItem key={task.id} task={task} />;
        })}
        {tasks?.length === 0 && <div className='tasks_list__items__empty'>No tasks yet!</div>}
      </div>
      {modalState.isOpen && modalState.type === 'list-edit' && <EditList />}
      {modalState.isOpen && modalState.type === 'task-edit' && <EditTask />}
    </div>
  );
};

export default ListIndex;
