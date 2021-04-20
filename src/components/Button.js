const Button = ({ disabled, outlined, onClick, children }) => {
  return (
    <button
      disabled={disabled}
      className={`py-2.5 px-5 border-solid border border-orange-500 rounded-sm font-roboto font-semibold duration-200${
        outlined
          ? ' bg-transparent text-orange-500 hover:bg-yellow-500 hover:bg-opacity-5'
          : ' bg-yellow-500 text-gray-500 hover:bg-yellow-400 hover:border-yellow-400'
      } `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;