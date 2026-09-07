import { dateRange } from '../../utils/cv';
import { sectionOrders, templates } from '../../templates/registry';
const headings = {
  en: { summary: 'Profile', experiences: 'Experience', educations: 'Education', skills: 'Skills', projects: 'Projects & Activities', certifications: 'Certifications & Training', languages: 'Languages', name: 'Your name', title: 'Your professional title' },
  id: { summary: 'Profil', experiences: 'Pengalaman', educations: 'Pendidikan', skills: 'Keterampilan', projects: 'Proyek & Kegiatan', certifications: 'Sertifikasi & Pelatihan', languages: 'Bahasa', name: 'Nama kamu', title: 'Judul profesional kamu' },
};
export default function CVPreview({ cvData }) {
  const { personal, summary, experiences, educations, skills, settings } = cvData;
  const labels = headings[settings.language] || headings.en;
  const template = templates.find(t => t.id === settings.template) || templates[0];
  const contacts = [personal.email, personal.phone, personal.location, personal.website, personal.linkedin, personal.github].filter(Boolean);
  const range = entry => { const text = dateRange(entry); return settings.language === 'id' ? text.replace('Present', 'Sekarang') : text; };
  const content = {
    summary: summary && <p className="preserve-lines">{summary}</p>,
    experiences: experiences.length > 0 && experiences.map(entry => <div className="cv-entry" key={entry.id}><div className="cv-row"><h3>{entry.position || (settings.language === 'id' ? 'Posisi' : 'Position')}</h3><span>{range(entry)}</span></div><p className="cv-subtitle">{[entry.company, entry.location].filter(Boolean).join(' · ')}</p><Description text={entry.description} /></div>),
    educations: educations.length > 0 && educations.map(entry => <div className="cv-entry" key={entry.id}><div className="cv-row"><h3>{entry.institution || (settings.language === 'id' ? 'Institusi' : 'Institution')}</h3><span>{range(entry)}</span></div><p className="cv-subtitle">{[entry.degree, entry.fieldOfStudy, entry.location].filter(Boolean).join(' · ')}</p><Description text={entry.description} /></div>),
    skills: skills.length > 0 && <div className="cv-skills">{skills.map((skill, i) => <span key={i}>{skill}</span>)}</div>,
    projects: cvData.projects?.length > 0 && cvData.projects.map(entry => <div className="cv-entry" key={entry.id}><div className="cv-row"><h3>{entry.name || labels.projects}</h3><span>{entry.date}</span></div>{entry.organization && <p className="cv-subtitle">{entry.organization}</p>}{entry.link && <p className="cv-link">{entry.link}</p>}<Description text={entry.description} /></div>),
    certifications: cvData.certifications?.length > 0 && cvData.certifications.map(entry => <div className="cv-entry" key={entry.id}><div className="cv-row"><h3>{entry.name || labels.certifications}</h3><span>{entry.date}</span></div>{entry.issuer && <p className="cv-subtitle">{entry.issuer}</p>}{entry.link && <p className="cv-link">{entry.link}</p>}</div>),
    languages: cvData.languages?.length > 0 && <div className="cv-skills">{cvData.languages.map(entry => <span key={entry.id}>{[entry.name, entry.level].filter(Boolean).join(' — ')}</span>)}</div>,
  };
  return <article className={`cv-paper template-${template.id} design-${template.design || 'original'} font-${template.font || 'default'}`} style={{ '--cv-accent': template.color }} aria-label="CV document" lang={settings.language || 'en'}>
    <header className="cv-header"><h1>{personal.fullName || labels.name}</h1><p className="cv-title">{personal.jobTitle || labels.title}</p>{contacts.length > 0 && <div className="cv-contact">{contacts.map((contact, i) => <span key={i}>{contact}</span>)}</div>}</header>
    <div className="cv-body">{sectionOrders[template.order].map(key => content[key] ? <section className="cv-section" key={key}><h2>{labels[key]}</h2>{content[key]}</section> : null)}</div>
  </article>;
}
function Description({ text }) { return text && <ul>{text.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>)}</ul>; }
