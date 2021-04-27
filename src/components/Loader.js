const Loader = ({ className, inButton }) => {
  return (
    <svg
      className={`${inButton ? 'absolute ' : ''}${
        inButton?.width || 'w-12 xs:w-8'
      } stroke-current ${
        inButton
          ? inButton.outlined
            ? 'text-orange-500 '
            : 'text-gray-500 '
          : 'text-orange-500 '
      }-rotate-90${className ? ` ${className}` : ''}`}
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="origin-center opacity-40 animate-loader-internal-circle-spin"
        strokeDasharray="187"
        cx="60"
        cy="60"
        r="30"
      ></circle>
      <circle
        className="origin-center opacity-90 animate-loader-external-circle-spin"
        strokeDasharray="312"
        cx="60"
        cy="60"
        r="50"
      ></circle>
    </svg>
  );
};

export default Loader;
