import { BackButton } from '@/components/BackButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FormActions } from '@/components/FormActions';
import { FormField } from '@/components/FormField';
import { PageTitle } from '@/components/PageTitle';
import { useId } from '@/hooks/useId';
import { deleteList, fetchLists, updateList } from '@/store/list';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';

const EditList = () => {
  const id = useId();

  const { listId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const list = useSelector((state) => state.list.lists?.find((list) => list.id === listId));

  useEffect(() => {
    if (list) {
      setTitle(list.title);
    }
  }, [list]);

  useEffect(() => {
    void dispatch(fetchLists());
  }, [listId, dispatch]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(updateList({ id: listId, title }))
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
    [title, listId, dispatch, navigate]
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }

    setIsSubmitting(true);

    void dispatch(deleteList({ id: listId }))
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
  }, [listId, dispatch, navigate]);

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

  return (
    <main className='edit_list'>
      <BackButton />
      <PageTitle className='edit_list__title'>Edit List</PageTitle>
      <ErrorMessage message={errorMessage} className='edit_list__error' />
      <form className='edit_list__form' onSubmit={onSubmit}>
        <FormField
          id={`${id}-title`}
          label='Name'
          className='app_input'
          placeholder='Family'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fieldClassName='edit_list__form_field'
          labelClassName='edit_list__form_label'
        />
        <FormActions
          cancelLink='/'
          cancelText='Cancel'
          submitText='Update'
          isSubmitting={isSubmitting}
          deleteButton={deleteButton}
          className='edit_list__form_actions'
          spacerClassName='edit_list__form_actions_spacer'
        />
      </form>
    </main>
  );
};

export default EditList;
