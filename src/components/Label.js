const Label = ({ className, children }) => {
  return (
    <label
      className={`block mb-3 xs:text-xs${className ? ` ${className}` : ''}`}
    >
      {children}
    </label>
  );
};

export default Label;
