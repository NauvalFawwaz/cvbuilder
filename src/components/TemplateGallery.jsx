import { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { templates } from '../templates/registry';
export default function TemplateGallery({ selected, onSelect }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const filtered = templates.filter(t => (category === 'Semua' || t.category === category) && `${t.name} ${t.caption} ${t.tag}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="gallery"><div className="gallery-heading"><span className="eyebrow">LEBIH BANYAK CERITA, LEBIH BANYAK PILIHAN</span><h2>Temukan gaya untuk langkahmu.</h2><p>{templates.length} template gratis. Semua bisa dipakai untuk bidang apa pun; pilih struktur yang paling membantu pembaca memahami pengalamanmu.</p></div>
    <div className="gallery-search"><Search size={16} /><input aria-label="Cari template" placeholder="Cari gaya atau bidang…" value={query} onChange={e => setQuery(e.target.value)} /></div>
    <div className="gallery-filters" aria-label="Kategori template">{['Semua', ...new Set(templates.map(t => t.category))].map(name => <button key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>
    <p className="gallery-count" role="status">{filtered.length} template ditampilkan · pilihan tidak mengubah isi CV</p>
    <div className="template-grid">{filtered.map(template => <button key={template.id} className={`template-card ${selected === template.id ? 'selected' : ''}`} onClick={() => onSelect(template.id)} aria-pressed={selected === template.id}>
      <div className={`template-mini mini-${template.id} mini-design-${template.design || 'original'} mini-font-${template.font || 'sans'}`} style={{ '--mini-color': template.color }} aria-hidden="true"><div className="mini-heading">ALEX MORGAN</div><div className="mini-subtitle">Your next opportunity</div><div className="mini-rule" />{[0, 1, 2].map(n => <div className="mini-section" key={n}><b>{(template.order === 'education' ? ['PROFILE', 'EDUCATION', 'PROJECTS'] : template.order === 'skills' ? ['PROFILE', 'SKILLS', 'EXPERIENCE'] : template.order === 'projects' ? ['PROFILE', 'PROJECTS', 'EXPERIENCE'] : template.order === 'credentials' ? ['PROFILE', 'CERTIFICATIONS', 'EXPERIENCE'] : ['PROFILE', 'EXPERIENCE', 'EDUCATION'])[n]}</b><i /><i /><i /></div>)}</div>
      <div className="template-label"><strong>{template.name}</strong>{selected === template.id && <Check size={17} />}<span>{template.caption}</span><small>{template.tag}</small></div>
    </button>)}</div>{filtered.length === 0 && <div className="empty-state">Belum ada template yang cocok dengan pencarianmu.<button className="secondary-button" onClick={() => { setQuery(''); setCategory('Semua'); }}>Tampilkan semua</button></div>}
  </div>;
}
