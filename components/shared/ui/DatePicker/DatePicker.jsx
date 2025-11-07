import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { setDraftAppointment } from '@/store/actions/appointments';

import s from './DatePicker.module.css';
import Calendar from './calendar/Calendar';

const DatePicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null); // Added state for selected option
  const [isCalendarCellSelected, setIsCalendarCellSelected] = useState(false); // New state
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const dispatch = useDispatch();
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);

  const handleSetToday = () => {
    setCurrentDate(new Date());
    setSelectedOption('today');
    setIsCalendarCellSelected(false); // Reset the state when Today is clicked
  };

  const getTomorrow = () => {
    setCurrentDate(new Date(+new Date() + 86400000));
    setSelectedOption('tomorrow');
    setIsCalendarCellSelected(false); // Reset the state when Tomorrow is clicked
  };

  const handleCalendarCellClick = () => {
    setIsCalendarCellSelected(true); // Set the state when a calendar cell is clicked
  };

  useEffect(() => {
    dispatch(setDraftAppointment({
      ...draftAppointment,
      selectedDate: format(currentDate, 'dd LLLL yyyy')
    }));
  }, [currentDate]);

  return (
    <div className={s.date_picker}>
      <div className={s.wrapper}>
        <div
          className={`${s.selectDay} ${selectedOption === 'today' && !isCalendarCellSelected ? s.selected : ''}`}
          onClick={handleSetToday}
        >
          {t.today}
        </div>
        <div
          className={`${s.selectDay} ${selectedOption === 'tomorrow' && !isCalendarCellSelected ? s.selected : ''}`}
          onClick={getTomorrow}
        >
          {t.tomorrow}
        </div>
      </div>

      <Calendar
        value={currentDate}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onCellClick={handleCalendarCellClick} // Pass the function to the Calendar component
      />
    </div>
  );
};

export default DatePicker;
