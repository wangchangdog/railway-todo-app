import { signup } from '@/store/auth';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = useCallback(
    async ({ email, name, password }) => {
      await dispatch(signup({ email, name, password })).unwrap();
      navigate('/');
    },
    [dispatch, navigate]
  );

  return {
    signup: handleSignup,
  };
};
