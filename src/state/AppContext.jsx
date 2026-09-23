import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { appReducer } from './reducers';
import { loadState, saveState } from '../services/storage';
import { getSeedState } from '../data/seed';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      let saved = await loadState();
      if (!saved) {
        saved = getSeedState();
        saveState(saved);
      }
      if (isMounted) {
        dispatch({ type: 'SET_STATE', payload: saved });
      }
    };
    init();

    const handleStorage = (e) => {
      if (e.key === 'mis:vendor-mgmt:v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          dispatch({ type: 'SET_STATE', payload: parsed });
        } catch (err) {
          console.error('Cross-tab sync failed', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  if (!state) return <div>Loading...</div>;

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
