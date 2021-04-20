const VARIATIONS = {
  DEFAULT:
    'bg-yellow-500 text-gray-500 hover:bg-yellow-400 hover:border-yellow-400',
  OUTLINED:
    'bg-transparent text-orange-500 hover:bg-yellow-500 hover:bg-opacity-5',
};

const Button = ({ disabled, wFull, hFull, outlined, onClick, children }) => {
  return (
    <button
      disabled={disabled}
      className={`disabled:opacity-80 ${wFull ? 'w-full' : ''} ${
        hFull ? 'h-full' : ''
      } py-2 px-6 border-solid border border-orange-500 rounded-sm font-roboto font-semibold duration-200 ${
        outlined ? VARIATIONS.OUTLINED : VARIATIONS.DEFAULT
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
