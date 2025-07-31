import { CheckIcon } from '@/icons/CheckIcon';
import { PencilIcon } from '@/icons/PencilIcon';
import { updateTask } from '@/store/task';
import { openModal } from '@/store/modalSlice';
import { calculateTimeRemaining, formatDateTimeForDisplay } from '@/utils/dateUtils';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import './index.css';

export const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const { listId } = useParams();
  const { id, title, detail, done, limit } = task;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = useCallback(() => {
    setIsSubmitting(true);
    void dispatch(updateTask({ id, done: !done })).finally(() => {
      setIsSubmitting(false);
    });
  }, [id, done, dispatch]);

  const handleEdit = useCallback(() => {
    dispatch(openModal({ type: 'task-edit', data: { listId, taskId: id } }));
  }, [dispatch, listId, id]);

  const timeRemaining = calculateTimeRemaining(limit);
  const formattedLimit = formatDateTimeForDisplay(limit);

  return (
    <div className='task_item'>
      <div className='task_item__title_container'>
        <button
          type='button'
          onClick={handleToggle}
          disabled={isSubmitting}
          className='task__item__mark_button'
        >
          {done ? (
            <div className='task_item__mark____complete' aria-label='Completed'>
              <CheckIcon className='task_item__mark____complete_check' />
            </div>
          ) : (
            <div className='task_item__mark____incomplete' aria-label='Incomplete'></div>
          )}
        </button>
        <div className='task_item__title' data-done={done}>
          {title}
        </div>
        <div aria-hidden className='task_item__title_spacer'></div>
        <button type='button' onClick={handleEdit} className='task_item__title_action'>
          <PencilIcon aria-label='Edit' />
        </button>
      </div>
      <div className='task_item__detail'>{detail}</div>
      {limit && (
        <div className='task_item__limit'>
          <div className='task_item__limit_date'>{formattedLimit}</div>
          {timeRemaining && (
            <div
              className={`task_item__time_remaining ${
                timeRemaining.isOverdue ? 'task_item__time_remaining--overdue' : ''
              }`}
            >
              {timeRemaining.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
