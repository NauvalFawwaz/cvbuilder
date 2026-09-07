export const initialCVData = {
  personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '' },
  summary: '', experiences: [], educations: [], skills: [], projects: [], certifications: [], languages: [],
  settings: { template: 'ats-classic', language: 'en' },
  jobTarget: { profile: 'general', stage: 'experienced', description: '', keywords: '' },
};
export const newEntry = (type) => ({
  id: crypto.randomUUID(), location: '', startDate: '', endDate: '', current: false, description: '',
  ...(type === 'experiences' ? { company: '', position: '' } : { institution: '', degree: '', fieldOfStudy: '' }),
});
