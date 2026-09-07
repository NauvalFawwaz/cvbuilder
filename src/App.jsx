import { useRef, useState } from 'react';
import { FileText, ShieldCheck, Download, Upload, RotateCcw, Check, ArrowUpRight, LayoutTemplate, PenLine, Eye, LockKeyhole, Target } from 'lucide-react';
import CVEditor from './components/editor/CVEditor';
import CVPreview from './components/preview/CVPreview';
import TemplateGallery from './components/TemplateGallery';
import CareerCoach from './components/CareerCoach';
import ConfirmDialog from './components/ConfirmDialog';
import { initialCVData } from './data/initialCVData';
import { exportCV, normalizeCV } from './utils/cv';
import { useCV } from './utils/useCV';
import { templates } from './templates/registry';
export default function App() {
  const { cvData, setCVData, saveStatus } = useCV();
  const [tab, setTab] = useState('editor');
  const [mobileView, setMobileView] = useState('edit');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(null);
  const fileInput = useRef(null);
  const currentTemplate = templates.find(t => t.id === cvData.settings.template);
  const importFile = async (event) => {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Please choose a JSON backup smaller than 2 MB.');
      const data = normalizeCV(JSON.parse(await file.text()));
      setAction({ title: 'Replace this draft?', description: 'The imported CV will replace your current draft. Export your current draft first if you want to keep it.', label: 'Import CV', run: () => { setCVData(data); setMessage('CV imported successfully.'); } });
    } catch (error) { setMessage(error instanceof SyntaxError ? 'This file is not valid JSON. Please choose a CV backup.' : error.message); }
  };
  const print = () => { const title = document.title; document.title = `${cvData.personal.fullName || 'My'} - CV`; window.print(); document.title = title; };
  return <>
    <header className="app-header no-print"><a href="#" className="brand"><span className="brand-icon"><FileText size={22} /></span>folio<span className="brand-dot">.</span><span className="brand-label">CV BUILDER</span></a><span className="privacy-badge"><ShieldCheck size={15} />100% free. Truly private.</span><button className="primary-button" onClick={print}><Download size={16} /><span>Download PDF</span><ArrowUpRight size={15} /></button></header>
    <main className="app-main"><div className="intro no-print"><div><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h1>Good work deserves<br className="mobile-break" /> a great CV.</h1><p>Your story. Your style. Your data stays yours.</p></div><div className="intro-note"><ShieldCheck size={21} /><span>No sign-up. No paywall.<br /><strong>Just possibilities.</strong></span></div></div>
      <div className="workspace-toolbar no-print"><div className="tabs"><button className={tab === 'editor' ? 'active' : ''} onClick={() => { setTab('editor'); setMobileView('edit'); }}><PenLine size={16} />Editor</button><button className={tab === 'templates' ? 'active' : ''} onClick={() => { setTab('templates'); setMobileView('edit'); }}><LayoutTemplate size={16} />Templates<span>{templates.length}</span></button><button className={tab === 'career' ? 'active' : ''} onClick={() => { setTab('career'); setMobileView('edit'); }}><Target size={16} />Siap Melamar</button></div><div className="file-actions"><button onClick={() => fileInput.current.click()}><Upload size={15} />Import JSON</button><button onClick={() => exportCV(cvData)}><Download size={15} />Export JSON</button><button className="reset-button" onClick={() => setAction({ title: 'Start with a clean page?', description: 'This clears your current CV on this device. Export a JSON backup first to keep a copy.', label: 'Reset CV', run: () => { setCVData(structuredClone(initialCVData)); setMessage('Your draft has been reset.'); } })}><RotateCcw size={15} />Reset</button><input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importFile} /></div></div>
      {message && <div role="status" className="notice no-print">{message}<button onClick={() => setMessage('')} aria-label="Dismiss message">×</button></div>}
      <div className="mobile-toggle no-print"><button className={mobileView === 'edit' ? 'active' : ''} onClick={() => setMobileView('edit')}><PenLine size={15} />Edit</button><button className={mobileView === 'preview' ? 'active' : ''} onClick={() => setMobileView('preview')}><Eye size={15} />Preview</button></div>
      <div className={`workspace view-${mobileView}`}>
        <div className="editing-panel no-print"><div className="panel-heading"><h2>{tab === 'editor' ? 'Build your story' : tab === 'career' ? 'Siap untuk langkah berikutnya' : 'Choose your style'}</h2><span className="save-status" role="status"><Check size={13} />{saveStatus}</span></div>{tab === 'editor' ? <CVEditor cvData={cvData} setCVData={setCVData} /> : tab === 'career' ? <CareerCoach cvData={cvData} setCVData={setCVData} onEdit={() => { setTab('editor'); setMobileView('edit'); }} /> : <TemplateGallery selected={cvData.settings.template} onSelect={template => setCVData(prev => ({ ...prev, settings: { ...prev.settings, template } }))} />}
          <div className="privacy-note"><LockKeyhole size={17} /><p><strong>Private by design.</strong> Your CV is saved only in this browser, on this device. No uploads, accounts, analytics, or AI processing. Export a backup before clearing browser data or switching devices.</p></div>
        </div>
        <div className="preview-panel"><div className="preview-toolbar no-print"><span><span className="live-dot" />Live preview</span><span>{currentTemplate.name} <label className="preview-language"><span className="sr-only">Bahasa judul bagian CV</span><select aria-label="Bahasa judul bagian CV" value={cvData.settings.language} onChange={e => setCVData(prev => ({ ...prev, settings: { ...prev.settings, language: e.target.value } }))}><option value="en">EN</option><option value="id">ID</option></select></label><span className="paper-label">A4</span></span></div><div className="paper-viewport"><CVPreview cvData={cvData} /></div><p className="print-hint no-print">Ready when you are. Choose “Save as PDF” in the print dialog.<br />A4 · Scale 100% · Turn off headers/footers · Enable background graphics</p></div>
      </div>
    </main><footer className="app-footer no-print"><span>100% Free & Privacy-First CV Builder</span><span>Made for your next opportunity. <span className="footer-star">✦</span></span></footer>
    <ConfirmDialog action={action} onClose={() => setAction(null)} />
  </>;
}


