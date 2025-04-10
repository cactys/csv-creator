import { InputForm, ErrorMessage, SuccessMessage } from '@UI';
import { useForm } from '@hooks';
import { MAX_BASE_LENGTH } from '@utils/constants';
import GenerationHistory from '../GenerationHistory/GenerationHistory';
import styles from './CsvGenerator.module.css';

const CsvGenerator = () => {
  const { values, handleInputChange, generateCsv, regenerateCsv, formFields } =
    useForm();

  console.log(values);

  return (
    <main className={styles.container}>
      <div className={styles.mainContent}>
        <InputForm
          fields={formFields}
          values={values}
          onChange={handleInputChange}
          history={values.history}
          numInfo={values.numInfo}
          maxBaseLength={MAX_BASE_LENGTH}
        />
        <ErrorMessage error={values.error} />
        <SuccessMessage success={values.success} />

        <section
          className={styles.statsSection}
          aria-label="Статистика генерации"
        >
          <article className={styles.statItem}>
            <h2>Последняя генерация</h2>
            <dl>
              <dt>Дата:</dt>
              <dd>{values.stats?.date || 'Нет данных'}</dd>

              <dt>Базовый ключ:</dt>
              <dd>{values.stats?.baseKey || 'Нет данных'}</dd>

              <dt>Начальный номер:</dt>
              <dd>{values.stats?.startNum || 'Нет данных'}</dd>

              <dt>Количество строк:</dt>
              <dd>{values.stats?.numLines || 'Нет данных'}</dd>

              <dt>Имя файла:</dt>
              <dd>{values.stats?.fileName || 'Нет данных'}</dd>
            </dl>
          </article>
        </section>

        <button
          onClick={generateCsv}
          className={styles.button}
          disabled={!values.baseKey || !values.fileName}
          aria-label="Создать CSV файл"
        >
          Создать CSV
        </button>
      </div>

      <GenerationHistory
        stats={values.stats}
        generationHistory={values.generationHistory}
        onRegenerate={regenerateCsv}
      />
    </main>
  );
};

export default CsvGenerator;
