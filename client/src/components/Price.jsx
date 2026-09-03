const Price = ({ amount, className = '' }) => (
  <span className={`price ${className}`}>
    {amount}
  </span>
);

export default Price;
