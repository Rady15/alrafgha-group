const Price = ({ children, className = '' }) => (
  <span className={`price ${className}`}>
    {children}
  </span>
);

export default Price;
