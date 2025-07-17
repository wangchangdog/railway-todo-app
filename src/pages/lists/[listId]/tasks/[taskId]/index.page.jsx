import {BackButton} from '@/components/BackButton';
import {ErrorMessage} from '@/components/ErrorMessage';
import {FormActions} from '@/components/FormActions';
import {FormField} from '@/components/FormField';
import {PageTitle} from '@/components/PageTitle';
import {useId} from '@/hooks/useId';
import {setCurrentList} from '@/store/list';
import {deleteTask, fetchTasks, updateTask} from '@/store/task';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import './index.css';

const EditTask = () => {
  const id = useId();

  const { listId, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = useSelector((state) => state.task.tasks?.find((task) => task.id === taskId));

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDetail(task.detail);
      setDone(task.done);
    }
  }, [task]);

  useEffect(() => {
    void dispatch(setCurrentList(listId));
    void dispatch(fetchTasks());
  }, [listId, dispatch]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(updateTask({ id: taskId, title, detail, done }))
        .unwrap()
        .then(() => {
          navigate(`/lists/${listId}`);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [title, taskId, listId, detail, done, dispatch, navigate]
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsSubmitting(true);

    void dispatch(deleteTask({ id: taskId }))
      .unwrap()
      .then(() => {
        navigate(`/`);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [taskId, dispatch, navigate]);

  const deleteButton = (
    <button
      type="button"
      className="app_button edit_list__form_actions_delete"
      disabled={isSubmitting}
      onClick={handleDelete}
    >
      Delete
    </button>
  );

  return (
    <main className='edit_list'>
      <BackButton />
      <PageTitle className='edit_list__title'>Edit Task</PageTitle>
      <ErrorMessage message={errorMessage} className='edit_list__error' />
      <form className='edit_list__form' onSubmit={onSubmit}>
        <FormField
          id={`${id}-title`}
          label="Title"
          className="app_input"
          placeholder="Buy some milk"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fieldClassName="edit_list__form_field"
          labelClassName="edit_list__form_label"
        />
        <FormField
          id={`${id}-detail`}
          label="Description"
          as="textarea"
          className="app_input"
          placeholder="Blah blah blah"
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          fieldClassName="edit_list__form_field"
          labelClassName="edit_list__form_label"
        />
        <FormField
          id={`${id}-done`}
          label="Is Done"
          type="checkbox"
          checked={done}
          onChange={(event) => setDone(event.target.checked)}
          fieldClassName="edit_list__form_field"
          labelClassName="edit_list__form_label"
        />
        <FormActions
          cancelLink="/"
          cancelText="Cancel"
          submitText="Update"
          isSubmitting={isSubmitting}
          deleteButton={deleteButton}
          className="edit_list__form_actions"
          spacerClassName="edit_list__form_actions_spacer"
        />
      </form>
    </main>
  );
};

export default EditTask;
