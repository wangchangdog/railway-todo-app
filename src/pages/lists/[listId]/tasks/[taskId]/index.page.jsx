import ErrorMessage from '@/components/ErrorMessage/index';
import { FormActions } from '@/components/FormActions/index';
import { FormField } from '@/components/FormField/index';
import Modal from '@/components/Modal/index';
import { useId } from '@/hooks/useId';
import { setCurrentList } from '@/store/list';
import { deleteTask, fetchTasks, updateTask } from '@/store/task';
import { closeModal } from '@/store/modalSlice';
import { convertToServerFormat, formatDateTimeForInput } from '@/utils/dateUtils';
import { detailValidation, titleValidation, validateDateTimeLocal } from '@/utils/validation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';

const EditTask = () => {
  const id = useId();
  const { listId, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = useSelector((state) => state.task.tasks?.find((task) => task.id === taskId));

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('detail', task.detail);
      setValue('done', task.done);
      setValue('limit', formatDateTimeForInput(task.limit));
    }
  }, [task, setValue]);

  useEffect(() => {
    void dispatch(setCurrentList(listId));
    void dispatch(fetchTasks());
  }, [listId, dispatch]);

  const onSubmit = useCallback(
    (data) => {
      setIsSubmitting(true);
      const limitFormatted = convertToServerFormat(data.limit);
      void dispatch(
        updateTask({ id: taskId, ...data, done: data.done || false, limit: limitFormatted })
      )
        .unwrap()
        .then(() => {
          dispatch(closeModal());
          navigate(`/lists/${listId}`);
        })
        .catch((err) => setErrorMessage(err.message))
        .finally(() => setIsSubmitting(false));
    },
    [taskId, listId, dispatch, navigate]
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsSubmitting(true);
    void dispatch(deleteTask({ id: taskId }))
      .unwrap()
      .then(() => {
        dispatch(closeModal());
        navigate('/');
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setIsSubmitting(false));
  }, [taskId, dispatch, navigate]);

  const deleteButton = (
    <button
      type='button'
      className='app_button edit_list__form_actions_delete'
      disabled={isSubmitting}
      onClick={handleDelete}
    >
      Delete
    </button>
  );

  const handleCancel = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <Modal title='Edit Task' onClose={handleCancel}>
      <main className='edit_list'>
        <ErrorMessage message={errorMessage} className='edit_list__error' />
        <form className='edit_list__form' onSubmit={handleSubmit(onSubmit)}>
          <FormField
            id={`${id}-title`}
            label='Title'
            className='app_input'
            placeholder='Buy some milk'
            fieldClassName='edit_list__form_field'
            labelClassName='edit_list__form_label'
            {...register('title', titleValidation)}
          />
          {errors.title && <p className='error-message'>{errors.title.message}</p>}
          <FormField
            id={`${id}-detail`}
            label='Description'
            as='textarea'
            className='app_input'
            placeholder='Blah blah blah'
            fieldClassName='edit_list__form_field'
            labelClassName='edit_list__form_label'
            {...register('detail', detailValidation)}
          />
          {errors.detail && <p className='error-message'>{errors.detail.message}</p>}
          <FormField
            id={`${id}-done`}
            label='Is Done'
            type='checkbox'
            fieldClassName='edit_list__form_field'
            labelClassName='edit_list__form_label'
            {...register('done')}
          />
          <FormField
            id={`${id}-limit`}
            label='Deadline'
            type='datetime-local'
            className='app_input'
            fieldClassName='edit_list__form_field'
            labelClassName='edit_list__form_label'
            {...register('limit', { validate: validateDateTimeLocal })}
          />
          {errors.limit && <p className='error-message'>{errors.limit.message}</p>}
          <FormActions
            onCancel={handleCancel}
            cancelText='Cancel'
            submitText='Update'
            isSubmitting={isSubmitting}
            deleteButton={deleteButton}
            className='edit_list__form_actions'
            spacerClassName='edit_list__form_actions_spacer'
            submitDisabled={!!errors.title || !!errors.detail || !!errors.limit}
          />
        </form>
      </main>
    </Modal>
  );
};

export default EditTask;
