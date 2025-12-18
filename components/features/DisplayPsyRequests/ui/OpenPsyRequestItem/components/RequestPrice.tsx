import React, { useEffect, useState } from 'react';

import s from '../OpenPsyRequestItem.module.css';

export const RequestPrice = ({ price }) => {
  const [adaToUsdRate, setAdaToUsdRate] = useState(null);

  useEffect(() => {
    const fetchAdaRate = async () => {
      try {
        const response = await fetch('/api/exchange-rate/ada-usd');
        const data = await response.json();
        if (data.success && data.rate) {
          setAdaToUsdRate(data.rate);
        } else {
          setAdaToUsdRate(0.5); // Fallback rate
        }
      } catch (error) {
        console.error('Failed to fetch ADA/USD rate:', error);
        setAdaToUsdRate(0.5); // Fallback rate
      }
    };
    fetchAdaRate();
  }, []);



  const priceInUSD = adaToUsdRate && adaToUsdRate > 0
    ? ((price / 100) * adaToUsdRate).toFixed(2)
    : (price / 100).toFixed(2); // Fallback: assume 1 ADA = 1 USD

  return (
    <div className={`${s.expPrice} ${s.col3}`}>
      {/* <div className={s.reqField}>{t.exp} {psyRank}</div> */}
      <div className={s.price}>
        {(price / 100).toFixed(2)} ADA (~${priceInUSD})
      </div>
    </div>
  );
};
