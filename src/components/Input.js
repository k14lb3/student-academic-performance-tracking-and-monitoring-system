import { forwardRef } from 'react';

const Input = (
  { className, defaultValue, value, type, maxLength, autoComplete, onChange , readOnly},
  ref
) => {
  return (
    <input
      ref={ref}
      className={`bg-gray-50 px-3 py-2 text-black xs:text-xs border border-gray-50 focus:border-black rounded ${
        className ? className : ''
      }`}
      defaultValue={defaultValue}
      value={value}
      type={type}
      autoComplete={autoComplete}
      onChange={onChange}
      maxLength={maxLength}
      readOnly={readOnly}
    ></input>
  );
};

export default forwardRef(Input);
