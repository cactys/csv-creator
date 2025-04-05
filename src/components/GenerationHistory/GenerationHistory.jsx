import PropTypes from 'prop-types';
import styles from './GenerationHistory.module.css';

const GenerationHistory = ({ stats, generationHistory, onRegenerate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCardClick = (item) => {
    if (onRegenerate) {
      onRegenerate(item);
    }
  };

  const renderCard = (item) => (
    <div
      key={item.date}
      className={styles.card}
      onClick={() => handleCardClick(item)}
      role="button"
      tabIndex={0}
      aria-label={`Повторно загрузить файл ${item.fileName}`}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.fileName}>{item.fileName}</h3>
        <time className={styles.date}>{formatDate(item.date)}</time>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Базовый ключ:</span>
          <span className={styles.value}>{item.baseKey}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Строки:</span>
          <span className={styles.value}>{item.startNum} - {item.startNum + item.numLines - 1}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Количество:</span>
          <span className={styles.value}>{item.numLines}</span>
        </div>
      </div>
    </div>
  );

  // Фильтруем историю, исключая последнюю генерацию
  const filteredHistory = generationHistory?.filter(item =>
    !stats || item.date !== stats.date
  );

  return (
    <aside className={styles.history}>
      <h2 className={styles.title}>История генераций</h2>

      {stats && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Последняя генерация</h3>
          {renderCard(stats)}
        </div>
      )}

      {filteredHistory && filteredHistory.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Предыдущие генерации</h3>
          {filteredHistory.map(renderCard)}
        </div>
      )}
    </aside>
  );
};

GenerationHistory.propTypes = {
  stats: PropTypes.shape({
    date: PropTypes.string.isRequired,
    baseKey: PropTypes.string.isRequired,
    startNum: PropTypes.number.isRequired,
    numLines: PropTypes.number.isRequired,
    fileName: PropTypes.string.isRequired
  }),
  generationHistory: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      baseKey: PropTypes.string.isRequired,
      startNum: PropTypes.number.isRequired,
      numLines: PropTypes.number.isRequired,
      fileName: PropTypes.string.isRequired
    })
  ).isRequired,
  onRegenerate: PropTypes.func
};

export default GenerationHistory;
