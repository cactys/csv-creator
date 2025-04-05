import PropTypes from 'prop-types';
import styles from './InputForm.module.css';

const InputForm = ({
  fields,
  values,
  onChange,
  history,
  numInfo,
  maxBaseLength
}) => {
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
          required
          aria-required="true"
          className={`${styles.input} ${styles.textInput}`}
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
          required
          aria-required="true"
          min={0}
          max={name === 'numLines' ? (numInfo.max - values.startNum + 1) : numInfo.max}
          className={styles.input}
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
      <fieldset>
        <legend>Параметры генерации</legend>

        <div className={styles.formGroup}>
          <label htmlFor="baseKey" className={styles.label}>Базовый ключ:</label>
          <input
            id="baseKey"
            type="text"
            value={values.baseKey}
            onChange={(e) => onChange('baseKey', e.target.value)}
            maxLength={maxBaseLength}
            required
            aria-required="true"
            aria-describedby="baseKeyInfo baseKeyPattern"
            pattern="[a-zA-Z0-9_]*"
            title="Допустимы только буквы (a-z, A-Z), цифры (0-9) и символ подчеркивания (_)"
            className={`${styles.input} ${styles.textInput}`}
          />
          <div id="baseKeyInfo" className={styles.info}>
            {values.baseKey ? (
              <>
                Доступно символов: {numInfo.length}
                {numInfo.length > 0 && ` (максимальное число: ${numInfo.max})`}
              </>
            ) : (
              `Доступно символов: ${maxBaseLength} (максимальное число: ${Math.pow(10, maxBaseLength) - 1})`
            )}
          </div>
          <div id="baseKeyPattern" className={`${styles.info} ${styles.pattern}`}>
            Допустимые символы: буквы (a-z, A-Z), цифры (0-9), символ подчеркивания (_)
          </div>
        </div>

        {history.length > 0 && (
          <div className={styles.formGroup}>
            <label htmlFor="history" className={styles.label}>История:</label>
            <select
              id="history"
              onChange={(e) => onChange('baseKey', e.target.value)}
              aria-label="Выберите значение из истории"
              className={`${styles.input} ${styles.textInput}`}
            >
              <option value="">Выберите значение</option>
              {history.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}

        {fields.map(({ name, label, type }) => (
          <div key={name} className={styles.formGroup}>
            <label htmlFor={name} className={styles.label}>{label}:</label>
            {renderNumberInput(name, label, type)}
            {name === 'numLines' && (
              <div id="numLinesInfo" className={styles.info}>
                Максимальное количество строк: {numInfo.max - values.startNum + 1}
              </div>
            )}
          </div>
        ))}
      </fieldset>
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
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  numInfo: PropTypes.shape({
    length: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired,
  maxBaseLength: PropTypes.number.isRequired
};

export default InputForm;
