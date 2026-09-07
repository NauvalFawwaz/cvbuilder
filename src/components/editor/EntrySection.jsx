import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { newEntry } from '../../data/initialCVData';
import FormInput from './FormInput';
export default function EntrySection({ type, entries = [], setCVData }) {
  const work = type === 'experiences';
  const title = work ? 'experience' : 'education';
  const fields = work ? [['position', 'Job title'], ['company', 'Company']] : [['institution', 'Institution'], ['degree', 'Degree'], ['fieldOfStudy', 'Field of study']];
  const change = (id, key, value) => setCVData(prev => ({ ...prev, [type]: prev[type].map(item => item.id === id ? { ...item, [key]: value } : item) }));
  const move = (index, offset) => setCVData(prev => { const items = [...prev[type]]; [items[index], items[index + offset]] = [items[index + offset], items[index]]; return { ...prev, [type]: items }; });
  return <div className="entry-list">{entries.length === 0 && <div className="empty-state">Your next chapter starts here.<span>Add your {title} to tell your story.</span></div>}
    {entries.map((item, index) => <div className="entry-card" key={item.id}>
      <div className="flex items-center justify-between gap-2"><h3>{work ? item.position || 'Experience' : item.institution || 'Education'} <small>{index + 1}</small></h3><div className="flex gap-1">
        <button className="icon-button" aria-label={`Move ${title} ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={15} /></button>
        <button className="icon-button" aria-label={`Move ${title} ${index + 1} down`} disabled={index === entries.length - 1} onClick={() => move(index, 1)}><ArrowDown size={15} /></button>
        <button className="icon-button danger" aria-label={`Remove ${title} ${index + 1}`} onClick={() => setCVData(prev => ({ ...prev, [type]: prev[type].filter(entry => entry.id !== item.id) }))}><Trash2 size={15} /></button>
      </div></div>
      <div className="form-grid">{[...fields, ['location', 'Location']].map(([key, label]) => <FormInput key={key} label={label} value={item[key]} onChange={event => change(item.id, key, event.target.value)} />)}
        <FormInput label="Start date" type="month" value={item.startDate} onChange={e => change(item.id, 'startDate', e.target.value)} />
        <FormInput label="End date" type="month" min={item.startDate || undefined} disabled={item.current} value={item.current ? '' : item.endDate} onChange={e => change(item.id, 'endDate', e.target.value)} />
      </div>
      <label className="checkbox"><input type="checkbox" checked={item.current} onChange={e => change(item.id, 'current', e.target.checked)} />{work ? 'I currently work here' : 'I am currently studying here'}</label>
      <FormInput label={work ? 'Achievements & responsibilities' : 'Highlights & achievements'} multiline placeholder="Write one achievement per line…" value={item.description} onChange={e => change(item.id, 'description', e.target.value)} />
    </div>)}
    <button className="add-button" onClick={() => setCVData(prev => ({ ...prev, [type]: [...prev[type], newEntry(type)] }))}><Plus size={17} />Add {title}</button>
  </div>;
}
