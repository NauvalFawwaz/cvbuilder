import { useEffect, useRef, useState } from 'react';
import { loadCV, STORAGE_KEY } from './cv';
export function useCV() {
  const [loaded] = useState(loadCV);
  const [cvData, setCVData] = useState(loaded.data);
  const [saveStatus, setSaveStatus] = useState(loaded.error || 'Saved on this device');
  const initial = useRef(loaded.data);
  useEffect(() => {
    if (cvData === initial.current) return;
    const timeout = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData)); setSaveStatus('Saved on this device'); }
      catch { setSaveStatus('Autosave unavailable. Export JSON to keep a backup.'); }
    }, 300);
    const saveOnExit = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData)); } catch { /* Storage failure is shown in the save status. */ } };
    window.addEventListener('pagehide', saveOnExit);
    return () => { clearTimeout(timeout); window.removeEventListener('pagehide', saveOnExit); };
  }, [cvData]);
  const update = (next) => { setSaveStatus('Saving…'); setCVData(next); };
  return { cvData, setCVData: update, saveStatus };
}
