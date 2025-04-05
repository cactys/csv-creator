import PropTypes from 'prop-types';
import styles from './SuccessMessage.module.css';

const SuccessMessage = ({ success }) => {
  if (!success) return null;

  return (
    <div
      className={styles.success}
      role="status"
      aria-live="polite"
    >
      {success}
    </div>
  );
};

SuccessMessage.propTypes = {
  success: PropTypes.string
};

export default SuccessMessage;
