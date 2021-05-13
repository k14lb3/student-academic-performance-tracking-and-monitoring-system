import { forwardRef } from 'react';

const Input = (props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`bg-gray-50 px-3 py-2 text-black xs:text-xs border border-gray-50 focus:border-black rounded ${
        props.className ? props.className : ''
      }`}
    ></input>
  );
};

export default forwardRef(Input);
