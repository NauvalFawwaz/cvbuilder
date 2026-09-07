import assert from 'node:assert/strict';
import { normalizeCV, dateRange } from './cv.js';
import { test } from 'node:test';
test('missing educations does not crash; legacy fields migrate', () => {
  const data = normalizeCV({ personal: { linkedIn: 'linkedin.com/in/example' }, education: [{ institution: 'School' }] });
  assert.equal(data.educations[0].institution, 'School');
  assert.equal(data.personal.linkedin, 'linkedin.com/in/example');
  assert.deepEqual(normalizeCV({ personal: {} }).educations, []);
});
test('malformed values are normalized without leaking unexpected fields', () => {
  const data = normalizeCV({ personal: { fullName: { bad: true } }, experiences: [null, 'bad', { company: 'Company' }], skills: [null, 'React', { name: 'CSS' }], settings: { template: 'unknown' } });
  assert.equal(data.personal.fullName, '');
  assert.equal(data.experiences.length, 1);
  assert.deepEqual(data.skills, ['React', 'CSS']);
  assert.equal(data.settings.template, 'ats-classic');
});
test('invalid backup is rejected and wrapped backups round-trip', () => {
  for (const bad of [null, [], {}, { personal: [] }]) assert.throws(() => normalizeCV(bad));
  const data = normalizeCV({ personal: { fullName: 'Alex' }, summary: 'Summary', skills: ['React'], settings: { template: 'developer' } });
  assert.deepEqual(normalizeCV(JSON.parse(JSON.stringify({ version: 1, cvData: data }))), data);
});
test('current role displays Present', () => {
  assert.equal(dateRange({ startDate: '2024-01', endDate: '', current: true }), 'Jan 2024 – Present');
});
import { analyzeKeywords, containsPhrase, reviewCV } from './career.js';
import { templates, sectionOrders } from '../templates/registry.js';
test('matching preserves technical punctuation and word boundaries', () => {
  assert.equal(containsPhrase('JavaScript', 'Java'), false);
  for (const term of ['C++', 'C#', '.NET']) assert.equal(containsPhrase('C++ / C# / .NET', term), true);
  assert.equal(containsPhrase('customer    service', 'customer service'), true);
  assert.equal(containsPhrase('marketing', 'R'), false);
  assert.equal(containsPhrase('Worked in R.', 'R'), true);
});
test('job target and contacts do not count as CV evidence; duplicates are ignored', () => {
  const data = normalizeCV({ personal: { email: 'python@example.com' }, jobTarget: { description: 'Python SQL Python', keywords: 'Python, python, SQL' } });
  assert.equal(analyzeKeywords(data).results.length, 2);
  assert.equal(analyzeKeywords(data).found, 0);
  data.projects.push({ name: 'Python analysis', description: 'Used SQL queries' });
  assert.equal(analyzeKeywords(data).found, 2);
});
test('old data gains safe optional sections and target settings', () => {
  const data = normalizeCV({ personal: {}, jobTarget: { profile: 'bad', stage: 'bad', description: {}, keywords: null }, settings: { language: 'bad' } });
  for (const section of ['projects', 'certifications', 'languages']) assert.deepEqual(data[section], []);
  assert.equal(data.settings.language, 'en');
  assert.deepEqual(data.jobTarget, { profile: 'general', stage: 'experienced', description: '', keywords: '' });
});
test('extended JSON round-trip retains additional sections and target', () => {
  const data = normalizeCV({ personal: {}, projects: [{ name: 'School project', description: 'Built a prototype' }], certifications: [{ name: 'Training', issuer: 'School' }], languages: [{ name: 'Indonesia', level: 'Native' }], jobTarget: { profile: 'research', keywords: 'Python' }, settings: { template: 'graduate', language: 'id' } });
  const imported = normalizeCV(JSON.parse(JSON.stringify({ version: 1, cvData: data })));
  assert.equal(imported.projects[0].name, 'School project');
  assert.equal(imported.certifications[0].issuer, 'School');
  assert.equal(imported.languages[0].level, 'Native');
  assert.equal(imported.settings.language, 'id');
  assert.equal(imported.settings.template, 'graduate');
  assert.equal(imported.jobTarget.profile, 'research');
});
test('review accepts projects without formal work and flags reversed dates', () => {
  const data = normalizeCV({ personal: {}, projects: [{ name: 'Volunteer project', description: 'Coordinated volunteers' }], educations: [{ startDate: '2025-06', endDate: '2024-06' }] });
  const review = reviewCV(data);
  assert.equal(review.find(c => c.id === 'evidence').pass, true);
  assert.equal(review.find(c => c.id === 'dates').pass, false);
  assert.equal(review.find(c => c.id === 'contact').pass, false);
});
test('all 18 templates have unique complete section orders', () => {
  assert.equal(templates.length, 18);
  assert.equal(new Set(templates.map(t => t.id)).size, 18);
  for (const template of templates) {
    const order = sectionOrders[template.order];
    assert.equal(new Set(order).size, 7);
    assert.deepEqual([...order].sort(), [...sectionOrders.experience].sort());
  }
});
