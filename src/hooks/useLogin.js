import { login } from '@/store/auth';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (email, password) => {
      await dispatch(login({ email, password })).unwrap();
      navigate('/');
    },
    [useDispatch]
  );

  return {
    login: handleLogin,
  };
};
