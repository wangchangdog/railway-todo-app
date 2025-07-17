import './PageTitle.css';

export const PageTitle = ({ children, className = 'page_title' }) => {
  return <h2 className={className}>{children}</h2>;
};
