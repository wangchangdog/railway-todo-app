import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { CheckIcon } from '@/icons/CheckIcon';
import { createTask } from '@/store/task';
import { convertToServerFormat } from '@/utils/dateUtils';
import { validateDateTimeLocal, titleValidation, detailValidation } from '@/utils/validation';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';

export const TaskCreateForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();
  const refForm = useRef(null);
  const [elemTextarea, setElemTextarea] = useState(null);
  const [formState, setFormState] = useState('initial');

  const done = watch('done', false);
  const title = watch('title', '');
  const detail = watch('detail', '');
  const limit = watch('limit', '');

  const handleToggle = useCallback(() => {
    setValue('done', !done);
  }, [done, setValue]);

  const handleFocus = useCallback(() => {
    setFormState('focused');
  }, []);

  const handleBlur = useCallback(() => {
    if (title || detail || limit) {
      return;
    }
    setTimeout(() => {
      const formElement = refForm.current;
      if (formElement && formElement.contains(document.activeElement)) {
        return;
      }
      setFormState('initial');
      reset();
    }, 100);
  }, [title, detail, limit, reset]);

  const handleDiscard = useCallback(() => {
    reset();
    setFormState('initial');
  }, [reset]);

  const onSubmit = useCallback((data) => {
    setFormState('submitting');
    const limitFormatted = convertToServerFormat(data.limit);
    void dispatch(createTask({ ...data, done: data.done || false, limit: limitFormatted }))
      .unwrap()
      .then(() => {
        handleDiscard();
      })
      .catch((err) => {
        alert(err.message);
        setFormState('focused');
      });
  }, [dispatch, handleDiscard]);

  useEffect(() => {
    if (!elemTextarea) return;
    const recalcHeight = () => {
      elemTextarea.style.height = 'auto';
      elemTextarea.style.height = `${elemTextarea.scrollHeight}px`;
    };
    elemTextarea.addEventListener('input', recalcHeight);
    recalcHeight();
    return () => elemTextarea.removeEventListener('input', recalcHeight);
  }, [elemTextarea]);

  return (
    <form ref={refForm} className='task_create_form' onSubmit={handleSubmit(onSubmit)} data-state={formState}>
      <div className='task_create_form__title_container'>
        <button
          type='button'
          onClick={handleToggle}
          className='task_create_form__mark_button'
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {done ? (
            <div className='task_create_form__mark____complete' aria-label='Completed'>
              <CheckIcon className='task_create_form__mark____complete_check' />
            </div>
          ) : (
            <div className='task_create_form__mark____incomplete' aria-label='Incomplete'></div>
          )}
        </button>
        <input
          type='text'
          className='task_create_form__title'
          placeholder='Add a new task...'
          {...register('title', titleValidation)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={formState === 'submitting'}
        />
      </div>
      {errors.title && <p className="error-message">{errors.title.message}</p>}
      <textarea
        ref={setElemTextarea}
        rows={1}
        className='task_create_form__detail'
        placeholder='Add a description here...'
        {...register('detail', detailValidation)}
        onBlur={handleBlur}
        disabled={formState === 'submitting'}
      />
      {errors.detail && <p className="error-message">{errors.detail.message}</p>}
      <input
        type='datetime-local'
        className='task_create_form__limit'
        placeholder='Set deadline...'
        {...register('limit', { validate: validateDateTimeLocal })}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={formState === 'submitting'}
      />
      {errors.limit && <p className="error-message">{errors.limit.message}</p>}
      <div className='task_create_form__actions'>
        <button
          type='button'
          className='app_button'
          data-variant='secondary'
          onBlur={handleBlur}
          onClick={handleDiscard}
          disabled={(!title && !detail && !limit) || formState === 'submitting'}
        >
          Discard
        </button>
        <div className='task_create_form__spacer'></div>
        <button
          type='submit'
          className='app_button'
          onBlur={handleBlur}
          disabled={!title || formState === 'submitting' || !!errors.title || !!errors.detail || !!errors.limit}
        >
          Add
        </button>
      </div>
    </form>
  );
};