import { forwardRef } from 'react';

const Select = ({ className, defaultValue, onChange, children }, ref) => {
  return (
    <select
      ref={ref}
      className={`bg-gray-50 px-3 py-2 text-black xs:text-xs border border-gray-50 rounded ${
        className ? className : ''
      }`}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

export default forwardRef(Select);
