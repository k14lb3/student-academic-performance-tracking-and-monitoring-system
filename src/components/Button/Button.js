import Loader from 'components/Loader';

const VARIATIONS = {
  DEFAULT:
    'bg-yellow-500 text-gray-500 hover:bg-yellow-400 hover:border-yellow-400 ',
  OUTLINED:
    'bg-transparent text-white hover:bg-yellow-500 hover:bg-opacity-5 ',
};

const Button = ({
  disabled,
  className,
  hasLoader,
  outlined,
  onClick,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      className={`disabled:opacity-80 ${
        hasLoader ? 'relative flex justify-center items-center ' : ''
      }py-2 px-5 border-solid border border-orange-500 rounded font-roboto font-medium xs:text-xs duration-200 ${
        outlined ? VARIATIONS.OUTLINED : VARIATIONS.DEFAULT
      }${className ? className : ''}`}
      onClick={onClick}
    >
      {children}
      {hasLoader && hasLoader.loading && (
        <Loader
          inButton={{ outlined: outlined, width: hasLoader.width || 'w-7' }}
        />
      )}
    </button>
  );
};

export default Button;
