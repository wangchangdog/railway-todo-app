import Layout from '@/components/Layout/Layout';
import { Sidebar } from '@/components/Sidebar';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import { fetchUser } from '@/store/auth/index';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes/Router';

function App() {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    void dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className='App'>
        <HamburgerMenu isOpen={isSidebarOpen} onClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        <Layout>
          <Router />
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
