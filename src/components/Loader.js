import './Loader.scss';

const Loader = () => {
  return (
    <svg
      className="loader"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="internal-circle" cx="60" cy="60" r="30"></circle>
      <circle className="external-circle" cx="60" cy="60" r="50"></circle>
    </svg>
  );
};

export default Loader;
