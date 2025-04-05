import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className={styles.error}
      role="alert"
      aria-live="polite"
    >
      {error}
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string
};

export default ErrorMessage;
