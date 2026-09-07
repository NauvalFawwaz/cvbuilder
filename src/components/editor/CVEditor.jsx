import { UserRound, AlignLeft, BriefcaseBusiness, GraduationCap, Sparkles, ChevronDown, FolderOpen, Award, Languages } from 'lucide-react';
import FormInput from './FormInput';
import AdditionalSection from './AdditionalSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
function Section({ icon: Icon, title, number, children }) {
  return <details className="editor-section" open><summary><span className="section-icon"><Icon size={18} /></span><h2>{title}</h2><span className="section-number">{number}</span><ChevronDown size={16} /></summary><div className="section-content">{children}</div></details>;
}
export default function CVEditor({ cvData, setCVData }) {
  const fields = [['fullName', 'Full name', 'Alex Morgan'], ['jobTitle', 'Professional title', 'Product Designer'], ['email', 'Email', 'alex@example.com'], ['phone', 'Phone', '+62 812 3456 7890'], ['location', 'Location', 'Jakarta, Indonesia'], ['website', 'Website', 'yourwebsite.com'], ['linkedin', 'LinkedIn', 'linkedin.com/in/yourname'], ['github', 'GitHub', 'github.com/yourname']];
  return <div className="editor-sections">
    <Section icon={UserRound} title="Personal information" number="01"><p className="section-hint">Make it easy for the right people to find you.</p><div className="form-grid">{fields.map(([key, label, placeholder]) => <FormInput key={key} label={label} placeholder={placeholder} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} value={cvData.personal[key]} onChange={e => setCVData(prev => ({ ...prev, personal: { ...prev.personal, [key]: e.target.value } }))} />)}</div></Section>
    <Section icon={AlignLeft} title="Professional summary" number="02"><FormInput label="Your story, in a few sentences" multiline placeholder="Describe your experience, strengths, and what you bring to your next role…" value={cvData.summary} onChange={e => setCVData(prev => ({ ...prev, summary: e.target.value }))} /></Section>
    <Section icon={BriefcaseBusiness} title="Work experience" number="03"><ExperienceSection experiences={cvData.experiences} setCVData={setCVData} /></Section>
    <Section icon={GraduationCap} title="Education" number="04"><EducationSection educations={cvData.educations} setCVData={setCVData} /></Section>
    <Section icon={Sparkles} title="Skills" number="05"><SkillsSection skills={cvData.skills} setCVData={setCVData} /></Section>
    <Section icon={FolderOpen} title="Proyek & kegiatan" number="06"><AdditionalSection type="projects" entries={cvData.projects} setCVData={setCVData} /></Section>
    <Section icon={Award} title="Sertifikasi & pelatihan" number="07"><AdditionalSection type="certifications" entries={cvData.certifications} setCVData={setCVData} /></Section>
    <Section icon={Languages} title="Bahasa" number="08"><AdditionalSection type="languages" entries={cvData.languages} setCVData={setCVData} /></Section>
  </div>;
}

