import { TIMEOUT_SEC } from './config.js';

export const getJSON = async function (url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_SEC * 1000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
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
