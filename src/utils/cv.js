import { initialCVData } from '../data/initialCVData.js';
import { templates } from '../templates/registry.js';
import { careerProfiles, careerStages } from '../data/careerProfiles.js';
export const STORAGE_KEY = 'free-cv-builder:v1';
const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const string = (value) => typeof value === 'string' ? value : '';
export function normalizeCV(value) {
  if (!object(value)) throw new Error('The file must contain a CV object.');
  const source = value.cvData ?? value;
  if (!object(source) || !object(source.personal)) throw new Error('Missing personal information. Choose a CV Builder JSON backup.');
  const personal = Object.fromEntries(Object.keys(initialCVData.personal).map(key => [key, string(source.personal[key])]));
  personal.linkedin ||= string(source.personal.linkedIn);
  const entries = (items, fields) => (Array.isArray(items) ? items : []).filter(object).map(item => ({
    id: crypto.randomUUID(), ...Object.fromEntries(fields.map(key => [key, string(item[key])])), current: item.current === true,
  }));
  return { personal, summary: string(source.summary),
    experiences: entries(source.experiences, ['company', 'position', 'location', 'startDate', 'endDate', 'description']),
    educations: entries(source.educations ?? source.education, ['institution', 'degree', 'fieldOfStudy', 'location', 'startDate', 'endDate', 'description']),
    skills: (Array.isArray(source.skills) ? source.skills : []).map(item => string(object(item) ? item.name : item)).filter(Boolean),
    projects: entries(source.projects, ['name', 'organization', 'date', 'link', 'description']),
    certifications: entries(source.certifications, ['name', 'issuer', 'date', 'link']),
    languages: entries(source.languages, ['name', 'level']),
    settings: { template: templates.some(t => t.id === source.settings?.template) ? source.settings.template : 'ats-classic', language: source.settings?.language === 'id' ? 'id' : 'en' },
    jobTarget: {
      profile: careerProfiles.some(p => p.id === source.jobTarget?.profile) ? source.jobTarget.profile : 'general',
      stage: careerStages.some(s => s.id === source.jobTarget?.stage) ? source.jobTarget.stage : 'experienced',
      description: string(source.jobTarget?.description).slice(0, 30000),
      keywords: string(source.jobTarget?.keywords).slice(0, 3000),
    },
  };
}
export function loadCV() {
  try { const saved = localStorage.getItem(STORAGE_KEY); return { data: saved ? normalizeCV(JSON.parse(saved)) : structuredClone(initialCVData), error: '' }; }
  catch { return { data: structuredClone(initialCVData), error: 'Saved data could not be read. Import a backup or edit to start a new draft.' }; }
}
export function exportCV(data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, cvData: data }, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = `${data.personal.fullName.trim().replace(/[^a-z0-9]+/gi, '-') || 'my'}-cv.json`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function dateRange(entry) {
  const format = value => /^\d{4}-\d{2}$/.test(value) ? new Date(`${value}-02T12:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : value;
  return [format(entry.startDate), entry.current ? 'Present' : format(entry.endDate)].filter(Boolean).join(' – ');
}

