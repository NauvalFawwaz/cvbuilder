import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export default function ConfirmDialog({ action, onClose }) {
  const ref = useRef(null);
  useEffect(() => { if (action) ref.current.showModal(); else ref.current.close(); }, [action]);
  return <dialog ref={ref} onCancel={onClose} className="confirm-dialog"><div className="flex items-center justify-between"><h2>{action?.title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div><p>{action?.description}</p><div className="flex justify-end gap-2"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => { action.run(); onClose(); }}>{action?.label}</button></div></dialog>;
}
