import { forwardRef } from 'react';

const Select = ({ className, defaultValue, onChange, children }, ref) => {
  return (
    <select
      ref={ref}
      className={`bg-gray-50 px-3 py-2 mt-3 text-black xs:text-xs border border-black rounded${
        ` ${className}` || ''
      }`}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

export default forwardRef(Select);
