import { careerProfiles } from '../data/careerProfiles.js';
const clean = value => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
export function containsPhrase(text, phrase) {
  const escaped = clean(phrase).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!escaped) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}_+#])${escaped}($|[^\\p{L}\\p{N}_+#])`, 'u').test(clean(text));
}
export function cvText(data) {
  const values = [data.personal.jobTitle, data.summary, ...data.skills];
  for (const [key, fields] of Object.entries({ experiences: ['position', 'company', 'description'], educations: ['institution', 'degree', 'fieldOfStudy', 'description'], projects: ['name', 'organization', 'description'], certifications: ['name', 'issuer'], languages: ['name', 'level'] })) {
    for (const item of data[key] || []) for (const field of fields) values.push(item[field] || '');
  }
  return values.join('\n');
}
export function analyzeKeywords(data) {
  const target = data.jobTarget || {};
  const manual = (target.keywords || '').split(/[,\n;]/).map(s => s.trim()).filter(Boolean);
  const suggested = careerProfiles.flatMap(profile => profile.keywords).filter(word => containsPhrase(target.description || '', word));
  const unique = new Map();
  for (const word of [...manual, ...suggested]) if (!unique.has(clean(word))) unique.set(clean(word), word);
  const text = cvText(data);
  const results = [...unique.values()].map(word => ({ word, found: containsPhrase(text, word), manual: manual.some(item => clean(item) === clean(word)) }));
  return { results, found: results.filter(item => item.found).length };
}
export function reviewCV(data) {
  const named = value => Boolean(value?.trim());
  const work = data.experiences.filter(item => named(item.position) && named(item.company));
  const projects = (data.projects || []).filter(item => named(item.name) && named(item.description));
  const dateIssues = [...data.experiences, ...data.educations].some(item => item.startDate && item.endDate && !item.current && item.startDate > item.endDate);
  const descriptions = [...work, ...projects].map(item => item.description || '').join(' ');
  return [
    { id: 'name', label: 'Nama lengkap', pass: named(data.personal.fullName), hint: 'Isi nama yang ingin kamu gunakan dalam lamaran.' },
    { id: 'contact', label: 'Kontak yang bisa dihubungi', pass: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email) || data.personal.phone.replace(/\D/g, '').length >= 7, hint: 'Tambahkan email yang valid atau nomor telepon. Periksa kembali penulisannya.' },
    { id: 'title', label: 'Arah posisi yang jelas', pass: named(data.personal.jobTitle), hint: 'Isi judul profesional yang relevan dan jujur untuk lowongan ini.' },
    { id: 'summary', label: 'Ringkasan profil', pass: named(data.summary), hint: 'Tulis beberapa kalimat tentang pengalaman, kekuatan, dan kontribusi yang relevan.' },
    { id: 'evidence', label: 'Bukti pengalaman atau proyek', pass: work.length > 0 || projects.length > 0, hint: 'Tambahkan pengalaman dengan posisi dan organisasi, atau proyek dengan nama serta uraian. Proyek sekolah dan sukarela juga dapat digunakan.' },
    { id: 'details', label: 'Kontribusi dijelaskan', pass: named(descriptions), hint: 'Jelaskan tindakan dan hasil dalam pengalaman atau proyek, bukan hanya jabatan.' },
    { id: 'skills', label: 'Keterampilan tercantum', pass: data.skills.some(named), hint: 'Masukkan keterampilan yang benar-benar kamu kuasai dan relevan.' },
    { id: 'dates', label: 'Urutan tanggal konsisten', pass: !dateIssues, hint: 'Ada tanggal akhir sebelum tanggal mulai. Periksa pengalaman dan pendidikan.' },
  ];
}
