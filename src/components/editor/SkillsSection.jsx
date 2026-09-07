import { useState } from 'react';
import { Plus, X } from 'lucide-react';
export default function SkillsSection({ skills, setCVData }) {
  const [input, setInput] = useState('');
  const add = (event) => { event.preventDefault(); const next = input.split(',').map(s => s.trim()).filter(Boolean); if (!next.length) return; setCVData(prev => ({ ...prev, skills: [...new Set([...prev.skills, ...next])] })); setInput(''); };
  return <div><p className="section-hint">Add your strengths, tools, and languages. Separate multiple skills with commas.</p><form onSubmit={add} className="flex gap-2"><input aria-label="New skills" placeholder="e.g. React, Project management" value={input} onChange={e => setInput(e.target.value)} /><button className="primary-button" aria-label="Add skills"><Plus size={18} /></button></form><div className="skill-chips">{skills.map((skill, i) => <span key={`${skill}-${i}`}>{skill}<button aria-label={`Remove ${skill}`} onClick={() => setCVData(prev => ({ ...prev, skills: prev.skills.filter((_, index) => index !== i) }))}><X size={14} /></button></span>)}</div></div>;
}
