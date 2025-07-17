import './FormField.css';

export const FormField = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  autoComplete,
  className = 'app_input',
  as = 'input',
  rows,
  checked,
  ...props
}) => {
  const InputComponent = as;
  
  return (
    <fieldset className='form_field'>
      <label htmlFor={id} className='form_label'>
        {label}
      </label>
      {type === 'checkbox' ? (
        <div>
          <input
            id={id}
            type={type}
            checked={checked}
            onChange={onChange}
            {...props}
          />
        </div>
      ) : (
        <InputComponent
          id={id}
          type={type}
          autoComplete={autoComplete}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          {...props}
        />
      )}
    </fieldset>
  );
};
