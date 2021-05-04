import { forwardRef } from 'react';

const Input = (
  { className, defaultValue, type, maxLength, autoComplete, onChange },
  ref
) => {
  return (
    <input
      ref={ref}
      className={`bg-gray-50 px-3 py-2 text-black xs:text-xs border border-gray-50 focus:border-black rounded${
        className ? className : ''
      }`}
      defaultValue={defaultValue}
      type={type}
      autoComplete={autoComplete}
      onChange={onChange}
      maxLength={maxLength}
    ></input>
  );
};

export default forwardRef(Input);
