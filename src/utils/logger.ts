import type { RoundLog } from '../types/game';

const LOG_STORAGE_KEY = 'cognitive_school_game_logs';

export function getStoredLogs(): RoundLog[] {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RoundLog[];
  } catch {
    return [];
  }
}

export function saveRoundLog(log: Omit<RoundLog, 'id' | 'timestamp' | 'rawTimestamp'>): RoundLog {
  const existing = getStoredLogs();
  const now = new Date();
  
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newLog: RoundLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    rawTimestamp: Date.now(),
    timestamp: formattedDate,
  };

  const updated = [newLog, ...existing];
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save log to localStorage:', err);
  }

  return newLog;
}

export function clearStoredLogs(): void {
  try {
    localStorage.removeItem(LOG_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear logs:', err);
  }
}

/**
 * Calculate starting difficulty level based on average level over the last 3 days.
 * Requirement: 세션(하루 접속) 시작 시: 직전 3일간의 평균 난이도로 리셋
 * If no logs in past 3 days, returns default Level 1.
 */
export function getInitialSessionLevel(): number {
  const logs = getStoredLogs();
  if (logs.length === 0) return 1;

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const cutoffTime = Date.now() - THREE_DAYS_MS;

  const recentLogs = logs.filter((log) => log.rawTimestamp >= cutoffTime);

  if (recentLogs.length === 0) {
    // If no logs in 3 days, fallback to the latest round level or Level 1
    return logs[0]?.difficultyLevel || 1;
  }

  const sumLevel = recentLogs.reduce((acc, l) => acc + l.difficultyLevel, 0);
  const avg = Math.round(sumLevel / recentLogs.length);

  // Clamp between 1 and 5
  return Math.min(Math.max(avg, 1), 5);
}

/**
 * Export all logs as downloadable JSON file
 */
export function downloadLogsAsJson(): void {
  const logs = getStoredLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cognitive_training_logs_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
