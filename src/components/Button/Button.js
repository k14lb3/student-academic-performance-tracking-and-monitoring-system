import { Link } from 'react-router-dom';
import Loader from 'components/Loader';

const VARIATIONS = {
  DEFAULT:
    'bg-orange text-gray-500 hover:bg-orange-400 hover:border-orange-400 ',
  OUTLINED: 'bg-transparent text-white hover:bg-orange hover:bg-opacity-5 ',
};

const Button = ({
  link,
  to,
  disabled,
  className,
  hasLoader,
  outlined,
  onClick,
  children,
}) => {
  return (
    <>
      {link ? (
        <Link
          to={to}
          className={`disabled:opacity-80 py-2 px-5 border-solid border border-orange-500 rounded font-roboto font-medium xs:text-xs text-center focus:border-black duration-200 ${
            outlined ? VARIATIONS.OUTLINED : VARIATIONS.DEFAULT
          }${className ? className : ''}`}
        >
          {children}
        </Link>
      ) : (
        <button
          disabled={disabled}
          className={`disabled:opacity-80 ${
            hasLoader ? 'relative flex justify-center items-center ' : ''
          }py-2 px-5 border-solid border border-orange-500 rounded font-roboto font-medium xs:text-xs focus:border-black duration-200 ${
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
      )}
    </>
  );
};

export default Button;
