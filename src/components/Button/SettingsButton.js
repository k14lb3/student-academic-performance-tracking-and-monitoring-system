import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SettingsButton = ({ to, icon, title, desc }) => {
  return (
    <Link
      to={to}
      className="group flex w-full p-5 xs:p-3 my-3 border border-orange-500 rounded duration-200 hover:bg-yellow-500 hover:bg-opacity-5 first:mt-0 last:mb-0"
    >
      {icon && (
        <div className="flex justify-center items-center mr-5 xs:mr-3 w-10 text-xl xs:text-sm group-hover:text-2xl xs:group-hover:text-base duration-200">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <div className="text-left">
        <h3 className="text-base xs:text-sm">{title}</h3>
        <p className="text-sm xs:text-xs text-gray-50">{desc}</p>
      </div>
    </Link>
  );
};

export default SettingsButton;
