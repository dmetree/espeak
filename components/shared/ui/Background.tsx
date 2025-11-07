export default function Background() {
  return (
    <div
      className="bg"
      data-theme={typeof window !== "undefined" && localStorage.getItem('theme') === 'dark-theme' ? 'dark-theme' : ''}
    />
  );
}
