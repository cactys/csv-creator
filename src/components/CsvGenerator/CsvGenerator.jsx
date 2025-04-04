import { useState, useEffect } from 'react';
import { styles } from './styles';
import { getFormattedDate, saveHistoryAndStats } from '../../utils/utils';
import {
  HISTORY_KEY,
  MAX_BASE_LENGTH,
  STATS_KEY,
  TOTAL_LENGTH,
} from '../../utils/constants';

const CsvGenerator = () => {
  const [state, setState] = useState({
    startNum: '',
    numLines: '',
    fileName: '',
    baseKey: 'xC119_2XL_',
    error: '',
    successMsg: '',
    numInfo: { length: 3, max: 999 },
    history: [],
    stats: [],
  });

  const validateInputs = () => {
    const errors = [];

    if (!/^[A-Za-z0-9_]+$/.test(state.baseKey)) {
      errors.push('Ключ содержит недопустимые символы (разрешены A-Z, 0-9, _)');
    }

    if (
      !state.startNum ||
      state.startNum < 1 ||
      state.startNum > state.numInfo.max
    ) {
      errors.push(`Начальный номер должен быть от 1 до ${state.numInfo.max}`);
    }

    if (!state.numLines || state.numLines < 1) {
      errors.push('Количество строк должно быть числом больше 0');
    }

    if (
      Number(state.startNum) + Number(state.numLines) - 1 >
      state.numInfo.max
    ) {
      errors.push(
        `Максимальный номер ${state.numInfo.max} (можно добавить не более ${
          state.numInfo.max - state.startNum + 1
        } строк)`
      );
    }

    return errors;
  };

  const handleGenerate = () => {
    setState((prev) => ({ ...prev, error: '', successMsg: '' }));

    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setState((prev) => ({ ...prev, error: validationErrors.join('\n') }));
      return;
    }

    try {
      const lines = Array.from({ length: state.numLines }, (_, i) => {
        const num = Number(state.startNum) + i;
        return `${state.baseKey.slice(0, MAX_BASE_LENGTH)}${num
          .toString()
          .padStart(state.numInfo.length, '0')}`.slice(0, TOTAL_LENGTH);
      });

      // Добавляем дату к имени файла
      const dateSuffix = getFormattedDate();
      const cleanFileName = `${state.fileName.replace(
        /[^A-Za-z0-9_-]/g,
        ''
      )}${dateSuffix}.csv`;
      const blob = new Blob([lines.join('\n')], {
        type: 'text/csv;charset=utf-8',
      });

      // Скачивание файла
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      // Сохранение статистики с номерами
      const start = Number(state.startNum);
      const end = start + Number(state.numLines) - 1;
      saveHistoryAndStats(
        state.baseKey,
        cleanFileName,
        state.numLines,
        start,
        end,
        state,
        setState
      );

      setState((prev) => ({
        ...prev,
        successMsg: `Файл ${cleanFileName} создан. Строк: ${state.numLines}, номера ${start}-${end}`,
      }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        error: `Ошибка генерации файла: ${e.message}`,
      }));
    }
  };

  const handleInputChange = (name, value) => {
    setState((prev) => {
      const newState = { ...prev };
      switch (name) {
        case 'baseKey':
          newState.baseKey = value
            .replace(/[^a-zA-Z0-9_]/g, '')
            .slice(0, MAX_BASE_LENGTH);
          break;
        case 'fileName':
          newState.fileName = value
            .replace(/[^A-Za-z0-9_-]/g, '')
            .replace(/\s/g, '_');
          break;
        case 'startNum':
          newState.startNum = Math.max(1, Math.min(state.numInfo.max, value));
          break;
        case 'numLines':
          newState.numLines = Math.max(1, value);
          break;
        default:
          break;
      }
      return newState;
    });
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = () => {
      try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        const stats = JSON.parse(localStorage.getItem(STATS_KEY)) || [];
        setState((prev) => ({ ...prev, history, stats }));
      } catch (e) {
        console.error('Ошибка загрузки данных:', e);
      }
    };
    loadData();
  }, []);

  // Обновление информации о нумерации
  useEffect(() => {
    const currentNumLength = TOTAL_LENGTH - state.baseKey.length;
    const calculatedNumLength = Math.max(1, currentNumLength);
    const calculatedMaxNum = 10 ** calculatedNumLength - 1;

    setState((prev) => ({
      ...prev,
      numInfo: { length: calculatedNumLength, max: calculatedMaxNum },
      startNum: prev.startNum > calculatedMaxNum ? '' : prev.startNum,
    }));
  }, [state.baseKey, state.startNum]);

  return (
    <div style={styles.container}>
      <h2>Генератор CSV</h2>

      <div style={styles.formGroup}>
        <label>
          Базовый ключ ({MAX_BASE_LENGTH} симв.):
          <input
            type="text"
            value={state.baseKey}
            onChange={(e) => handleInputChange('baseKey', e.target.value)}
            style={styles.input}
            list="historyList"
          />
          <datalist id="historyList">
            {state.history.map((key, i) => (
              <option key={i} value={key} />
            ))}
          </datalist>
        </label>
        <div style={styles.hint}>
          {`Символов для нумерации: ${state.numInfo.length} (Макс. значение: ${state.numInfo.max})`}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label>
          Начальный номер:
          <input
            type="number"
            value={state.startNum}
            onChange={(e) => handleInputChange('startNum', e.target.value)}
            style={styles.input}
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label>
          Количество строк:
          <input
            type="number"
            value={state.numLines}
            onChange={(e) => handleInputChange('numLines', e.target.value)}
            style={styles.input}
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label>
          Имя файла:
          <input
            type="text"
            value={state.fileName}
            onChange={(e) => handleInputChange('fileName', e.target.value)}
            style={styles.input}
          />
        </label>
      </div>

      {state.error && <div style={styles.error}>{state.error}</div>}
      {state.successMsg && <div style={styles.success}>{state.successMsg}</div>}

      <div style={styles.statsSection}>
        <h3>Последние генерации:</h3>
        {state.stats
          .slice(-5)
          .reverse()
          .map((stat, i) => (
            <div key={i} style={styles.statItem}>
              <div>Файл: {stat.fileName}</div>
              <div>Ключ: {stat.key}</div>
              <div>
                Строки: {stat.count} ({stat.startNum} - {stat.endNum})
              </div>
              <div>Дата: {new Date(stat.timestamp).toLocaleString()}</div>
            </div>
          ))}
      </div>

      <button
        style={{
          ...styles.button.base,
          ...((!state.startNum || !state.numLines) && styles.button.disabled),
        }}
        onClick={handleGenerate}
        disabled={!state.startNum || !state.numLines}
        aria-disabled={!state.startNum || !state.numLines}
      >
        Сгенерировать CSV
      </button>
    </div>
  );
};

export default CsvGenerator;
