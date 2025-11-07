import { useEffect, useState } from 'react';

export const checkConnection = () => {
  return fetch('connectivitycheck.gstatic.com/generate_204');
};

export const useOnlineStatus = () => {
  const [online, setOnline] = useState<boolean | undefined>(undefined);

  const updateState = () => {
    checkConnection()
      .then(() => {
        setOnline(true);
      })
      .catch(() => {
        setOnline(false);
      });
  };

  const intLengthMs = 10 * 1000; // 10 secs

  useEffect(() => {
    updateState();

    const id = setInterval(() => {
      updateState();
    }, intLengthMs);

    return () => clearInterval(id);
  }, []);

  return online;
};
