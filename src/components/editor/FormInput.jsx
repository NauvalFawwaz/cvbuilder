import { useId } from 'react';
export default function FormInput({ label, multiline, ...props }) {
  const id = useId();
  return <div className="field"><label htmlFor={id}>{label}</label>{multiline ? <textarea id={id} rows={4} {...props} /> : <input id={id} type="text" {...props} />}</div>;
}
