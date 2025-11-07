
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import cls from './TableHead.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

export const TableHead = () => {

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <div className={cls.wrap}>
      <ul className={cls.headList}>
        <li className={cls.headItem}>
          {t.request_subject}
          <Tooltip title={t.request_subject_tooltip} />
        </li>
        <li className={cls.headItem}>
          {t.time_and_date}
          <Tooltip title={t.time_and_date_tooltip} />
        </li>
        {/* <li className={cls.headItem}>
          {t('status')}
          <Tooltip title={t('status_tooltip')} />
        </li> */}
        <li className={cls.headItem}>
          {t.exp_and_price}
          <Tooltip title={t.exp_and_price_tooltip} />
        </li>
        <li className={cls.headItem}>
          {t.action_btn}
          <Tooltip title={t.action_btn_tooltip} />
        </li>
      </ul>
    </div>
  );
};
