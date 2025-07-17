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
  fieldClassName,
  labelClassName,
  ...props
}) => {
  const InputComponent = as;
  
  // デフォルトのクラス名を設定、カスタムクラス名がある場合はそれを使用
  const finalFieldClassName = fieldClassName || 'form_field';
  const finalLabelClassName = labelClassName || 'form_label';
  
  return (
    <fieldset className={finalFieldClassName}>
      <label htmlFor={id} className={finalLabelClassName}>
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
