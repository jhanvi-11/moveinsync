import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadState, saveState, clearState } from './storage';
import { SCHEMA_VERSION, STORAGE_KEY } from '../utils/constants';

describe('storage service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearState();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('round-trips AppState successfully', async () => {
    const mockState = {
      vendors: [{ id: '1', name: 'Test' }],
    };
    saveState(mockState);
    vi.advanceTimersByTime(350);

    const loadedPromise = loadState();
    await vi.advanceTimersByTimeAsync(250);
    const loaded = await loadedPromise;
    
    expect(loaded).toBeDefined();
    expect(loaded.vendors).toEqual(mockState.vendors);
    expect(loaded.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('honors schemaVersion', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 999, vendors: [] }));
    const loadedPromise = loadState();
    await vi.advanceTimersByTimeAsync(250);
    const loaded = await loadedPromise;
    
    expect(loaded).toBeNull();
  });

  it('debounce coalesces writes', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    saveState({ step: 1 });
    saveState({ step: 2 });
    saveState({ step: 3 });

    vi.advanceTimersByTime(350);

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    const savedCall = JSON.parse(setItemSpy.mock.calls[0][1]);
    expect(savedCall.step).toBe(3);
    
    setItemSpy.mockRestore();
  });
});
