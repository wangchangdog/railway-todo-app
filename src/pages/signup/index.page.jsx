import ErrorMessage from '@/components/ErrorMessage/index';
import { FormActions } from '@/components/FormActions/index';
import { FormField } from '@/components/FormField/index';
import { PageTitle } from '@/components/PageTitle/index';
import { useId } from '@/hooks/useId';
import { useSignup } from '@/hooks/useSignup';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './index.css';

const SignUp = () => {
  const auth = useSelector((state) => state.auth.token !== null);

  const id = useId();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { signup } = useSignup();

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      signup({ email, name, password })
        .catch((err) => {
          setErrorMessage(`サインアップに失敗しました: ${err.message}`);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [email, name, password, signup]
  );

  if (auth) {
    return <Navigate to='/' />;
  }

  return (
    <main className='signup'>
      <PageTitle className='signup__title'>Register</PageTitle>
      <ErrorMessage message={errorMessage} className='signup__error' />
      <form className='signup__form' onSubmit={onSubmit}>
        <FormField
          id={`${id}-email`}
          label='E-mail Address'
          autoComplete='email'
          className='app_input'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fieldClassName='signup__form_field'
          labelClassName='signup__form_label'
        />
        <FormField
          id={`${id}-name`}
          label='Name'
          type='text'
          autoComplete='name'
          className='app_input'
          value={name}
          onChange={(event) => setName(event.target.value)}
          fieldClassName='signup__form_field'
          labelClassName='signup__form_label'
        />
        <FormField
          id={`${id}-password`}
          label='Password'
          type='password'
          autoComplete='new-password'
          className='app_input'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fieldClassName='signup__form_field'
          labelClassName='signup__form_label'
        />
        <FormActions
          cancelLink='/signin'
          cancelText='Login'
          submitText='Register'
          isSubmitting={isSubmitting}
          className='signup__form_actions'
          spacerClassName='signup__form_actions_spacer'
        />
      </form>
    </main>
  );
};

export default SignUp;
