'use client';

import React, { useEffect, useState } from 'react';
import s from '../OpenPsyRequestItem.module.css';

type ApiResponse = {
  success: boolean;
  rate?: number;
};

export const RequestPrice = ({ price }: { price: number }) => {
  const [adaToUsdRate, setAdaToUsdRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdaRate = async () => {
      try {
        const res = await fetch('/api/exchange-rate/ada-usd');

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const data: ApiResponse = await res.json();

        if (data.success && typeof data.rate === 'number') {
          setAdaToUsdRate(data.rate);
        }
      } catch (error) {
        console.error('Failed to fetch ADA/USD rate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdaRate();
  }, []);

  const priceInUSD = price / 100;

  const priceInADA =
    adaToUsdRate && adaToUsdRate > 0
      ? (priceInUSD / adaToUsdRate).toFixed(2)
      : null;

  return (
    <div className={`${s.expPrice} ${s.col3}`}>
      <div className={s.price}>
        ${priceInUSD.toFixed(2)}{' '}
        {loading
          ? '(loading ADA rate…)'
          : priceInADA
          ? `(~${priceInADA} ADA)`
          : '(ADA rate unavailable)'}
      </div>
    </div>
  );
};
