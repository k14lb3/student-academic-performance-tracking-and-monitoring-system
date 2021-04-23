import { forwardRef } from 'react';

const Input = ({ className, defaultValue, type, onChange }, ref) => {
  return (
    <input
      ref={ref}
      className={`bg-gray-50 px-3 py-2 text-black xs:text-xs border border-gray-50 focus:border-black rounded${
        ` ${className}` || ''
      }`}
      defaultValue={defaultValue}
      type={type}
      onChange={onChange}
    ></input>
  );
};

export default forwardRef(Input);
