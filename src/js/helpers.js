import { TIMEOUT_SEC } from './config.js';

const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getJSON = async function (url) {
  // Check cache first
  const cached = responseCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_SEC * 1000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Store in cache
    responseCache.set(url, { data, timestamp: Date.now() });

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(
        `Request took too long! Timeout after ${TIMEOUT_SEC} seconds`,
      );
    }
    throw err;
  }
};

export const debounce = function (func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
