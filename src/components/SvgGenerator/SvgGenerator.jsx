import { useState, useEffect } from 'react';
import { styles } from './styles';

const TOTAL_LENGTH = 12;
const MAX_BASE_LENGTH = TOTAL_LENGTH - 1;

const SvgGenerator = () => {
  const [startNum, setStartNum] = useState('');
  const [numLines, setNumLines] = useState('');
  const [fileName, setFileName] = useState('C378_XL');
  const [baseKey, setBaseKey] = useState('xC378_XL');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [numInfo, setNumInfo] = useState({ length: 3, max: 999 });

  const validateBaseKey = (key) => {
    const regex = /^[A-Za-z0-9_]+$/;
    return regex.test(key);
  };

  const handleGenerate = () => {
    setError('');
    setSuccessMsg('');

    // Валидация базового ключа
    if (!validateBaseKey(baseKey)) {
      setError('Ключ содержит недопустимые символы (разрешены A-Z, 0-9, _)');
      return;
    }

    // Проверка длины ключа
    const trimmedKey = baseKey.slice(0, MAX_BASE_LENGTH);
    const finalNumLength = Math.max(1, TOTAL_LENGTH - trimmedKey.length);
    const finalMaxNum = Math.pow(10, finalNumLength) - 1;

    // Валидация стартового номера
    const start = parseInt(startNum, 10);
    if (isNaN(start) || start < 1 || start > finalMaxNum)
      setError(`Начальный номер должен быть от 1 до ${finalMaxNum}`);

    // Валидация количества строк
    const count = parseInt(numLines, 10);
    if (isNaN(count) || count < 1)
      setError('Количество строк должно быть числом больше 0');

    // Проверка конечного номера
    const end = start + count - 1;
    if (end > finalMaxNum)
      setError(
        `Максимальный ${finalMaxNum} номер (можно добавить не более ${
          finalMaxNum - start + 1
        } строк)`
      );

    // Генерация данных
    const lines = Array.from({ length: count }, (_, i) => {
      const num = start + i;
      const numStr = num.toString().padStart(finalNumLength, '0');
      const fullString = `${trimmedKey}${numStr}`.slice(0, TOTAL_LENGTH);

      if (fullString.length !== TOTAL_LENGTH) {
        setError(
          `Ошибка генерации: длина строки ${fullString} (${fullString.length} символов)`
        );
        return null;
      }
      return fullString;
    });

    if (lines.some((line) => line === null)) return;

    // Создание файла
    const cleanFileName = `${fileName.replace(/[^A-Za-x0-9_-]/g, '')}.csv`;
    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuccessMsg(
      `Файл ${cleanFileName} создан. Строк: ${count}, номера ${start}-${end}`
    );
  };

  const handleBaseKeyChange = (e) => {
    const value = e.target.value
      .replace(/[^a-zA-Z0-9_]/g, '')
      .slice(0, MAX_BASE_LENGTH);

    setBaseKey(value);
  };

  const handleFileNameChange = (e) => {
    const value = e.target.value
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .replace(/\s/g, '_');

    setFileName(value);
  };

  useEffect(() => {
    const currentNumberLength = TOTAL_LENGTH - baseKey.length;
    const calculatedNumLength = Math.max(1, currentNumberLength);
    const calculatedMaxNum = Math.pow(10, calculatedNumLength) - 1;

    setNumInfo({
      length: calculatedNumLength,
      max: calculatedMaxNum,
    });
  }, [baseKey]);

  return (
    <div style={styles.container}>
      <h2>Генератор CSV</h2>
      <div style={styles.formGroup}>
        <label>
          Базовый ключ ({MAX_BASE_LENGTH} символов):
          <input
            type="text"
            value={baseKey}
            style={styles.input}
            onChange={handleBaseKeyChange}
            placeholder={`Введите ${MAX_BASE_LENGTH} символов`}
          />
        </label>
        <div style={styles.hint}>
          Доступно символов для нумерации: {numInfo.length} (макс. число:
          {numInfo.max})
        </div>
      </div>
      <div style={styles.formGroup}>
        <label>
          Начальный номер (1-999):
          <input
            type="number"
            value={startNum}
            style={styles.input}
            onChange={(e) => setStartNum(e.target.value)}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label>
          Количество строк:
          <input
            type="number"
            value={numLines}
            style={styles.input}
            onChange={(e) => setNumLines(e.target.value)}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label>
          Имя файла:
          <input
            type="text"
            value={fileName}
            style={styles.input}
            onChange={handleFileNameChange}
            placeholder="Имя файла"
          />
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {successMsg && <p style={styles.success}>{successMsg}</p>}

      <button style={styles.button} onClick={handleGenerate}>
        Сгенерировать CSV
      </button>
    </div>
  );
};

export default SvgGenerator;
