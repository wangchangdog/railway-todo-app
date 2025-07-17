import axios from '@/vendor/axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { setToken, setUser } from './store/auth';
import { store } from './store/index';

axios.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (err) => {
    // 401を返す場合はReduxストアも更新
    if (err && err.response && err.response.status === 401) {
      store.dispatch(setToken(null));
      store.dispatch(setUser(null));
    }
    
    return Promise.reject(err);
  }
);

const root = document.getElementById('root');
const rootElement = createRoot(root);
rootElement.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
