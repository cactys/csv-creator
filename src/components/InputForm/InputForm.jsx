import PropTypes from 'prop-types';
import styles from './InputForm.module.css';

const InputForm = ({ fields, values, onChange, history, numInfo, maxBaseLength }) => {
  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? 0 : Number(value);
    onChange(field, numValue);
  };

  const handleIncrement = (field) => {
    const currentValue = values[field];
    const maxValue = field === 'startNum' ? numInfo.max : (numInfo.max - values.startNum + 1);
    if (currentValue < maxValue) {
      onChange(field, currentValue + 1);
    }
  };

  const handleDecrement = (field) => {
    const currentValue = values[field];
    const minValue = field === 'startNum' ? 0 : 1;
    if (currentValue > minValue) {
      onChange(field, currentValue - 1);
    }
  };

  const renderNumberInput = (name, label, type) => {
    if (type !== 'number') {
      return (
        <input
          id={name}
          type={type}
          value={values[name]}
          onChange={(e) => onChange(name, e.target.value)}
          className={styles.input}
          placeholder={`Введите ${label.toLowerCase()}`}
        />
      );
    }

    return (
      <div className={styles.inputWrapper}>
        <button
          type="button"
          className={styles.numberButton}
          onClick={() => handleDecrement(name)}
          disabled={name === 'startNum' ? values[name] <= 0 : values[name] <= 1}
          aria-label={`Уменьшить ${label}`}
        >
          -
        </button>
        <input
          id={name}
          type={type}
          value={values[name]}
          onChange={(e) => handleNumberChange(name, e.target.value)}
          className={styles.input}
          placeholder={`Введите ${label.toLowerCase()}`}
        />
        <button
          type="button"
          className={styles.numberButton}
          onClick={() => handleIncrement(name)}
          disabled={
            name === 'startNum'
              ? values[name] >= numInfo.max
              : values[name] >= (numInfo.max - values.startNum + 1)
          }
          aria-label={`Увеличить ${label}`}
        >
          +
        </button>
      </div>
    );
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="baseKey">
          Базовый ключ
        </label>
        <input
          id="baseKey"
          type="text"
          value={values.baseKey}
          onChange={(e) => onChange('baseKey', e.target.value)}
          className={styles.input}
          placeholder="Введите базовый ключ"
          maxLength={maxBaseLength}
        />
        <span className={styles.hint}>
          Максимальная длина: {maxBaseLength} символов.
          Допустимые символы: a-z, A-Z, 0-9, _
        </span>
      </div>

      {fields.map(({ name, label, type }) => (
        <div key={name} className={styles.field}>
          <label className={styles.label} htmlFor={name}>
            {label}
          </label>
          {renderNumberInput(name, label, type)}
          {name === 'numLines' && (
            <span className={styles.hint}>
              Максимальное количество строк: {numInfo.max - values.startNum + 1}
            </span>
          )}
        </div>
      ))}
    </form>
  );
};

InputForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  values: PropTypes.shape({
    baseKey: PropTypes.string.isRequired,
    startNum: PropTypes.number.isRequired,
    numLines: PropTypes.number.isRequired,
    fileName: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  numInfo: PropTypes.shape({
    length: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired,
  maxBaseLength: PropTypes.number.isRequired
};

export default InputForm;
