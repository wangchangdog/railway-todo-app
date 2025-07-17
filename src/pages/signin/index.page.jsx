import ErrorMessage from '@/components/ErrorMessage/index';
import { FormActions } from '@/components/FormActions/index';
import { FormField } from '@/components/FormField/index';
import { PageTitle } from '@/components/PageTitle/index';
import { useId } from '@/hooks/useId';
import { useLogin } from '@/hooks/useLogin';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './index.css';

const SignIn = () => {
  const auth = useSelector((state) => state.auth.token !== null);
  const { login } = useLogin();

  const id = useId();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      login({ email, password })
        .catch((err) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [email, password, login]
  );

  if (auth) {
    return <Navigate to='/' />;
  }

  return (
    <main className='signin'>
      <PageTitle className='signin__title'>Login</PageTitle>
      <ErrorMessage message={errorMessage} className='signin__error' />
      <form className='signin__form' onSubmit={onSubmit}>
        <FormField
          id={`${id}-email`}
          label='E-mail Address'
          type='email'
          autoComplete='email'
          className='app_input'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fieldClassName='signin__form_field'
          labelClassName='signin__form_label'
        />
        <FormField
          id={`${id}-password`}
          label='Password'
          type='password'
          autoComplete='current-password'
          className='app_input'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fieldClassName='signin__form_field'
          labelClassName='signin__form_label'
        />
        <FormActions
          cancelLink='/signup'
          cancelText='Register'
          submitText='Login'
          isSubmitting={isSubmitting}
          className='signin__form_actions'
          spacerClassName='signin__form_actions_spacer'
        />
      </form>
    </main>
  );
};

export default SignIn;
