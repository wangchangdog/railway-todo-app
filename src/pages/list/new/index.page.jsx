import BackButton from '@/components/BackButton/index';
import ErrorMessage from '@/components/ErrorMessage/index';
import { FormActions } from '@/components/FormActions/index';
import { FormField } from '@/components/FormField/index';
import { PageTitle } from '@/components/PageTitle/index';
import { useId } from '@/hooks/useId';
import { createList, setCurrentList } from '@/store/list/index';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './index.css';

const NewList = () => {
  const id = useId();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(createList({ title }))
        .unwrap()
        .then((listId) => {
          dispatch(setCurrentList(listId));
          navigate(`/`);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [title, dispatch, navigate]
  );

  return (
    <main className='new_list'>
      <BackButton />
      <PageTitle className='new_list__title'>New List</PageTitle>
      <ErrorMessage message={errorMessage} className='new_list__error' />
      <form className='new_list__form' onSubmit={onSubmit}>
        <FormField
          id={`${id}-title`}
          label='Name'
          className='app_input'
          placeholder='Family'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fieldClassName='new_list__form_field'
          labelClassName='new_list__form_label'
        />
        <FormActions
          cancelLink='/'
          cancelText='Cancel'
          submitText='Create'
          isSubmitting={isSubmitting}
          className='new_list__form_actions'
          spacerClassName='new_list__form_actions_spacer'
        />
      </form>
    </main>
  );
};

export default NewList;
