import './AccountInformationItem.scss';
import { Link } from 'react-router-dom';

const AccountInformationItem = ({ link, title, info }) => {
  return (
    <Link to={link} className="accountInformationItem button">
      <h3 className="accountInformationItem__title">{title}</h3>
      <div className="accountInformationItem__info">{info}</div>
    </Link>
  );
};

export default AccountInformationItem;
