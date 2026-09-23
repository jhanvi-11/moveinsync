import { STORAGE_KEY, SCHEMA_VERSION } from '../utils/constants';

let writeTimeout = null;

export const loadState = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          resolve(null);
          return;
        }
        const data = JSON.parse(raw);
        if (data.schemaVersion !== SCHEMA_VERSION) {
          console.warn('Schema version mismatch, resetting state');
          resolve(null);
          return;
        }
        resolve(data);
      } catch (e) {
        console.error('Failed to load state', e);
        resolve(null);
      }
    }, 200); // 200ms simulated async
  });
};

export const saveState = (state) => {
  if (writeTimeout) {
    clearTimeout(writeTimeout);
  }
  writeTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, schemaVersion: SCHEMA_VERSION }));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        window.dispatchEvent(new Event('storage-quota-exceeded'));
      }
      console.error('Failed to save state', e);
    }
  }, 300); // 300ms debounce
};

export const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
};
