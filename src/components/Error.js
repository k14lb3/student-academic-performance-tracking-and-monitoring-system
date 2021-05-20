const Error = ({ className, error }) => {
  return (
    <div
      className={`mt-1 xs:text-xs text-red${className ? ` ${className}` : ''}`}
    >
      {error}
    </div>
  );
};

export default Error;
