import { HISTORY_KEY, STATS_KEY } from "./constants";

export const getFormattedDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `_${day}-${month}-${year}_${hours}-${minutes}`;
};

export const saveHistoryAndStats = (newKey, fileName, count, start, end, state, setState) => {
  const timestamp = new Date().toISOString();
  const newHistory = [...new Set([newKey, ...state.history])].slice(0, 10);
  const newStats = [
    ...state.stats,
    {
      key: newKey,
      fileName,
      count,
      startNum: start,
      endNum: end,
      timestamp,
    },
  ].slice(-50);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));

  setState((prev) => ({
    ...prev,
    history: newHistory,
    stats: newStats,
  }));
};
