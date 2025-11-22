import s from './FormWrapper.module.css';

export function FormWrapper({ title, children }) {
  return (
    <div key={title}>
      <h2 className={s.title}>{title}</h2>
      <div className={s.content}>{children}</div>
    </div>
  );
}
