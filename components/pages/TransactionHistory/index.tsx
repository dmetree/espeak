import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { fetchMyAppointments } from '@/store/actions/appointments';
import { getLocalizedContent } from '@/hooks/localize';
import Sidebar from '@/components/features/SidebarES';
import styles from './styles.module.scss';
import spacetime from 'spacetime';

// Cardano explorer URLs
const CARDANO_EXPLORER_PREPROD = 'https://preprod.cexplorer.io/tx/';
const CARDANO_EXPLORER_MAINNET = 'https://beta.cexplorer.io/tx/';

// ADA to USD conversion (this should ideally come from an API)
const ADA_TO_USD = 0.5; // Placeholder - should fetch from API

interface Transaction {
  id: string;
  description: string;
  date: Date;
  txId: string;
  amount: number; // price in cents
  type: 'request' | 'accept' | 'withdraw' | 'refund';
}

export default function TransactionHistory() {
  const dispatch = useDispatch();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const userUid = useSelector(({ user }) => user?.uid);
  const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
  const [isLoading, setIsLoading] = useState(true);
  const [adaToUsdRate, setAdaToUsdRate] = useState<number | null>(null);

  // Determine if we're on pre-prod or mainnet
  const isPreProd = process.env.NEXT_PUBLIC_CARDANO_NETWORK === 'preprod' ||
                    process.env.NEXT_PUBLIC_CARDANO_NETWORK === 'preview';
  const explorerBaseUrl = isPreProd ? CARDANO_EXPLORER_PREPROD : CARDANO_EXPLORER_MAINNET;

  // Fetch ADA/USD exchange rate
  useEffect(() => {
    const fetchAdaRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
        const data = await response.json();
        if (data.cardano?.usd) {
          setAdaToUsdRate(data.cardano.usd);
        }
      } catch (error) {
        console.error('Failed to fetch ADA/USD rate:', error);
        // Fallback to a default rate if API fails
        setAdaToUsdRate(0.5);
      }
    };
    fetchAdaRate();
  }, []);


  useEffect(() => {
    if (userUid) {
      dispatch(fetchMyAppointments(userUid) as any).then(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, userUid]);


  const transactions = useMemo(() => {
    if (!myAppointments || !userUid) return [];

    const txList: Transaction[] = [];

    myAppointments.forEach((appointment: any) => {
      const isClient = appointment.clientUid === userUid;
      const isSpecialist = appointment.specUid === userUid;

      // Get description from selectedService or subject
      let description = '';
      if (appointment.selectedService?.title) {
        description = getLocalizedContent(appointment.selectedService.title, currentLocale) ||
                     Object.values(appointment.selectedService.title)[0] ||
                     'Service';
      } else if (appointment.subject) {
        description = t[appointment.subject] || appointment.subject;
      } else {
        description = t.general_lesson || 'Lesson';
      }

      // Request transaction (when student books)
      if (appointment.txId && isClient) {
        const createdDate = appointment.created_at?.toDate
          ? appointment.created_at.toDate()
          : new Date(appointment.created_at?.seconds * 1000 || Date.now());

        txList.push({
          id: `${appointment.id}-request`,
          description,
          date: createdDate,
          txId: appointment.txId,
          amount: appointment.price || 0,
          type: 'request',
        });
      }

      // Accept transaction (when teacher accepts)
      if (appointment.acceptationTxId && isSpecialist) {
        // Use created_at or a timestamp field for accept time
        const acceptDate = appointment.created_at?.toDate
          ? appointment.created_at.toDate()
          : new Date(appointment.created_at?.seconds * 1000 || Date.now());

        txList.push({
          id: `${appointment.id}-accept`,
          description: `${t.accepted || 'Accepted'}: ${description}`,
          date: acceptDate,
          txId: appointment.acceptationTxId,
          amount: appointment.price || 0,
          type: 'accept',
        });
      }

      // Withdraw transaction (when teacher claims rewards)
      // Note: This might need to be stored separately or in a different collection
      // For now, we'll check if there's a withdrawTxId field
      if (appointment.withdrawTxId && isSpecialist) {
        const withdrawDate = appointment.created_at?.toDate
          ? appointment.created_at.toDate()
          : new Date(appointment.created_at?.seconds * 1000 || Date.now());

        txList.push({
          id: `${appointment.id}-withdraw`,
          description: `${t.withdrawn || 'Withdrawn'}: ${description}`,
          date: withdrawDate,
          txId: appointment.withdrawTxId,
          amount: appointment.price || 0,
          type: 'withdraw',
        });
      }
    });

    // Sort by date (newest first)
    return txList.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [myAppointments, userUid, currentLocale, t]);

  const formatDate = (date: Date) => {
    const st = spacetime(date);
    return st.format('{date-ordinal} {month-short} {year}');
  };

  const formatTime = (date: Date) => {
    const st = spacetime(date);
    return st.format('time-24');
  };

  // Format ADA amount: price is stored in cents, and at booking time 1 USD = 1 ADA
  // So ADA = price / 100 (e.g., 5000 cents = $50 = 50 ADA at booking time)
  const formatADA = (tx: Transaction) => {
    // Price is stored in cents, and at booking 1 USD = 1 ADA
    // So ADA amount = price / 100
    const adaAmount = tx.amount / 100;
    return adaAmount.toFixed(2);
  };

  // Format USD amount: convert the ADA amount to current USD using exchange rate
  const formatUSD = (tx: Transaction) => {
    // Price is stored in cents, and at booking 1 USD = 1 ADA
    // So ADA amount = price / 100
    const adaAmount = tx.amount / 100;

    // Convert ADA to current USD using real exchange rate
    if (adaToUsdRate && adaToUsdRate > 0) {
      const currentUsd = adaAmount * adaToUsdRate;
      return currentUsd.toFixed(2);
    }

    // Fallback: if exchange rate not available, assume 1 ADA = 1 USD (booking rate)
    return adaAmount.toFixed(2);
  };

  const getExplorerUrl = (txId: string) => {
    return `${explorerBaseUrl}${txId}`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.loading}>Loading transactions...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t.transaction_history || 'Transaction History'}</h1>

          {transactions.length === 0 ? (
            <div className={styles.empty}>
              <p>{t.no_transactions || 'No transactions found.'}</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.description || 'Description'}</th>
                    <th>{t.date || 'Date'}</th>
                    <th>{t.time || 'Time'}</th>
                    <th>{t.transaction_id || 'Transaction ID'}</th>
                    <th>{t.amount_ada || 'Amount (ADA)'}</th>
                    <th>{t.amount_usd || 'Amount (USD)'}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className={styles.description}>{tx.description}</td>
                      <td>{formatDate(tx.date)}</td>
                      <td>{formatTime(tx.date)}</td>
                      <td>
                        <a
                          href={getExplorerUrl(tx.txId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.txLink}
                        >
                          {tx.txId.slice(0, 8)}...{tx.txId.slice(-8)}
                        </a>
                      </td>
                      <td className={styles.amount}>{formatADA(tx)} ADA</td>
                      <td className={styles.amount}>${formatUSD(tx)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
