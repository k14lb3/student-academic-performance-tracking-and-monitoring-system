import { forwardRef } from 'react';

const Input = ({ className, numberOnly, onChange, ...rest }, ref) => {
  const checkIfNumber = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  };

  return (
    <input
      ref={ref}
      {...rest}
      className={`bg-gray-50 px-3 py-2 text-black xs:text-xs border border-gray-50 focus:border-black rounded duration-200${
        className ? ` ${className}` : ''
      }`}
      onChange={(e) => {
        if (numberOnly) {
          checkIfNumber(e);
        }
        if (onChange) {
          onChange(e);
        }
      }}
    ></input>
  );
};

export default forwardRef(Input);
