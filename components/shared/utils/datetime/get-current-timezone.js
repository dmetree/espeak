import spacetime from 'spacetime';

export const getCurrentTimeZone = () => {
  return spacetime.now().timezone().name;
};
