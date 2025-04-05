import { useState, useEffect } from 'react';
import { MAX_BASE_LENGTH } from '@utils/constants';
import { generateCsv } from '@utils/utils';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState({
    baseKey: '',
    startNum: 0,
    numLines: 1,
    fileName: '',
    error: '',
    success: '',
    history: [],
    numInfo: { length: MAX_BASE_LENGTH, max: Math.pow(10, MAX_BASE_LENGTH) - 1 },
    stats: null,
    generationHistory: [],
    ...initialValues
  });

  useEffect(() => {
    // Загружаем историю
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) {
      setValues(prev => ({ ...prev, history: JSON.parse(savedHistory) }));
    }

    // Загружаем статистику
    const savedStats = localStorage.getItem('stats');
    if (savedStats) {
      setValues(prev => ({ ...prev, stats: JSON.parse(savedStats) }));
    }

    // Загружаем историю генераций
    const savedGenerationHistory = localStorage.getItem('generationHistory');
    if (savedGenerationHistory) {
      setValues(prev => ({ ...prev, generationHistory: JSON.parse(savedGenerationHistory) }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setValues(prev => {
      const newState = { ...prev };

      if (field === 'startNum') {
        newState[field] = value === '' ? 0 : Number(value);
      }
      else if (field === 'numLines') {
        const numValue = value === '' ? 1 : Number(value);
        const maxLines = prev.numInfo.max - prev.startNum + 1;

        if (numValue > maxLines) {
          newState.error = `Количество строк не должно превышать ${maxLines}`;
          return newState;
        }

        newState[field] = Math.max(1, numValue);
        newState.error = '';
      }
      else if (field === 'baseKey') {
        if (value && !/^[a-zA-Z0-9_]*$/.test(value)) {
          newState.error = 'Базовый ключ может содержать только буквы (a-z, A-Z), цифры (0-9) и символ подчеркивания (_)';
          return newState;
        }
        newState[field] = value;
        newState.error = '';
      }
      else {
        newState[field] = value;
      }

      if (field === 'baseKey') {
        const length = value ? MAX_BASE_LENGTH - value.length : MAX_BASE_LENGTH;
        const max = Math.pow(10, length) - 1;
        newState.numInfo = { length, max };

        if (newState.startNum > max) {
          newState.startNum = 0;
        }

        // Проверяем, не превышает ли numLines новый максимум
        const maxLines = max - newState.startNum + 1;
        if (newState.numLines > maxLines) {
          newState.numLines = maxLines;
        }
      }

      return newState;
    });
  };

  const validateInputs = () => {
    if (!values.baseKey) {
      setValues(prev => ({ ...prev, error: 'Введите базовый ключ' }));
      return false;
    }
    if (!/^[a-zA-Z0-9_]*$/.test(values.baseKey)) {
      setValues(prev => ({ ...prev, error: 'Базовый ключ может содержать только буквы (a-z, A-Z), цифры (0-9) и символ подчеркивания (_)' }));
      return false;
    }
    if (values.baseKey.length > MAX_BASE_LENGTH) {
      setValues(prev => ({ ...prev, error: `Базовый ключ не должен превышать ${MAX_BASE_LENGTH} символов` }));
      return false;
    }
    if (values.startNum < 0) {
      setValues(prev => ({ ...prev, error: 'Начальный номер должен быть больше или равен 0' }));
      return false;
    }
    if (values.startNum > values.numInfo.max) {
      setValues(prev => ({ ...prev, error: `Начальный номер не должен превышать ${values.numInfo.max}` }));
      return false;
    }
    if (values.numLines < 1) {
      setValues(prev => ({ ...prev, error: 'Количество строк должно быть больше 0' }));
      return false;
    }

    const maxLines = values.numInfo.max - values.startNum + 1;
    if (values.numLines > maxLines) {
      setValues(prev => ({ ...prev, error: `Количество строк не должно превышать ${maxLines}` }));
      return false;
    }

    if (values.startNum + values.numLines - 1 > values.numInfo.max) {
      setValues(prev => ({ ...prev, error: `Сумма начального номера и количества строк не должна превышать ${values.numInfo.max}` }));
      return false;
    }
    if (!values.fileName) {
      setValues(prev => ({ ...prev, error: 'Введите имя файла' }));
      return false;
    }
    return true;
  };

  const handleGenerateCsv = () => {
    if (!validateInputs()) return;

    const { newHistory, stats } = generateCsv(values);

    // Добавляем новую генерацию в историю
    const newGenerationHistory = [stats, ...values.generationHistory].slice(0, 10);
    localStorage.setItem('generationHistory', JSON.stringify(newGenerationHistory));

    setValues(prev => ({
      ...prev,
      history: newHistory,
      stats,
      generationHistory: newGenerationHistory,
      success: 'Файл успешно создан!'
    }));
  };

  const handleRegenerate = (item) => {
    // Создаем временные значения для генерации
    const tempValues = {
      ...values,
      baseKey: item.baseKey,
      startNum: item.startNum,
      numLines: item.numLines,
      fileName: item.fileName,
      numInfo: {
        length: MAX_BASE_LENGTH - item.baseKey.length,
        max: Math.pow(10, MAX_BASE_LENGTH - item.baseKey.length) - 1
      }
    };

    // Генерируем CSV с этими значениями
    const { newHistory, stats } = generateCsv(tempValues);

    // Обновляем состояние без добавления в историю
    setValues(prev => ({
      ...prev,
      history: newHistory,
      stats,
      success: 'Файл успешно создан!'
    }));
  };

  const formFields = [
    {
      name: 'startNum',
      label: 'Начальный номер',
      type: 'number'
    },
    {
      name: 'numLines',
      label: 'Количество строк',
      type: 'number'
    },
    {
      name: 'fileName',
      label: 'Имя файла',
      type: 'text'
    }
  ];

  return {
    values,
    handleInputChange,
    validateInputs,
    generateCsv: handleGenerateCsv,
    regenerateCsv: handleRegenerate,
    formFields
  };
};

export default useForm;
