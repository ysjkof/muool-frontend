import { useReducer, useRef } from 'react';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  compareDateMatch,
  createDate,
  getHoursByUnit,
  getMinutesByUnit,
} from '../../../utils/date.utils';
import { Calendar } from '../../../svgs';
import { cls, getPositionRef } from '../../../utils/common.utils';
import ModalPortal from '../../templates/ModalPortal';
import { TableTime } from '../../../models';
import {
  DatepickerCalendarButtonsProps,
  DatePickerInterface,
  DayProps,
  TimeSelectorProps,
} from '../../../types/datepicker.types';

// TODO: 완전 새로 만들어야해
function Buttons({ attributes }: DatepickerCalendarButtonsProps) {
  return (
    <>
      {attributes.map((attribute, idx) => {
        const { onClick, children, inactivate } = attribute;
        return (
          <button
            key={`datepicker__calendar-body__button-${idx}`}
            type="button"
            onClick={inactivate ? undefined : onClick}
            className={
              inactivate ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          >
            {children}
          </button>
        );
      })}
    </>
  );
}

function Day({
  day,
  isSunday,
  isSaturday,
  isThisMonth,
  isToday,
  isSelect,
  inactivate,
  onClick,
}: DayProps) {
  if (inactivate) {
    return (
      <button
        type="button"
        className={cls(
          'pointer-events-none px-1.5 py-1 line-through opacity-50',
          isSunday ? 'sunday' : '',
          isSaturday ? 'saturday' : ''
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cls(
        'cursor-pointer px-1.5 py-1',
        isSunday ? 'sunday' : '',
        isSaturday ? 'saturday' : '',
        isThisMonth ? 'opacity-50' : '',
        isSelect ? 'rounded-md  ring-2 ring-red-500' : '',
        isToday ? 'rounded-md bg-red-400 text-white' : ''
      )}
      onClick={onClick}
    >
      {day}
    </button>
  );
}

function TimeSelector({
  type,
  numbers,
  inputDate,
  setInputDate,
  closeDatepicker,
}: TimeSelectorProps) {
  const selectHour = (hour: string) => {
    if (inputDate.hour === hour) return closeDatepicker();
    setInputDate((prevDate) => {
      return { ...prevDate, hour };
    });
  };
  const selectMinute = (minute: string) => {
    if (inputDate.minute === minute) return closeDatepicker();
    setInputDate((prevDate) => {
      return { ...prevDate, minute };
    });
  };

  return (
    <div className="hidden-scrollbar flex flex-col overflow-y-scroll">
      <span>{type}</span>
      {numbers.map((number) => (
        <button
          type="button"
          key={`time-selector-${type}-${number}`}
          className={cls(
            'cursor-pointer px-1.5',
            +inputDate.hour === number
              ? 'rounded-md bg-blue-500 text-white'
              : ''
          )}
          onClick={
            type === '시'
              ? () => selectHour(`${number}`)
              : () => selectMinute(`${number}`)
          }
        >
          {`${number}`.padStart(2, '0')}
        </button>
      ))}
    </div>
  );
}

export function DatepickerCalendar({
  inputDate,
  setInputDate,
  isOpen,
  setOpen,
  hasHour,
}: DatePickerInterface) {
  const today = createDate();

  const changeShowMonthReducer = (
    state: Date[],
    action: 'increment' | 'decrement' | 'thisMonth'
  ) => {
    const newDate = createDate(state[15]);
    switch (action) {
      case 'increment':
        newDate.setMonth(newDate.getMonth() + 1);
        return getWeeksOfMonth(newDate);
      case 'decrement':
        newDate.setMonth(newDate.getMonth() - 1);
        return getWeeksOfMonth(newDate);
      case 'thisMonth':
        return getWeeksOfMonth(today);
      default:
        throw new Error('일어날 수 없는 일 입니다');
    }
  };

  const [showMonthCalendar, changeShowMonth] = useReducer(
    changeShowMonthReducer,
    getWeeksOfMonth(today)
  );

  const ref = useRef<HTMLButtonElement>(null);
  const { top, left } = getPositionRef(ref, 2);

  function getWeeks(value: Date, option?: 'sunday') {
    const result: Date[] = [];
    const date = new Date(value);
    const day = date.getDay();
    const sunday = new Date(date.setDate(date.getDate() - day));
    if (option === 'sunday') {
      return result.concat(sunday);
    }
    for (let i = 0; i < 7; i += 1) {
      const aDay = new Date(sunday);
      aDay.setDate(sunday.getDate() + i);
      result.push(aDay);
    }
    return result;
  }

  function getWeeksOfMonth(value: Date) {
    const result = [];
    const firstDate = new Date(value);
    const lastDate = new Date(firstDate);
    firstDate.setDate(1);
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    for (let i = 0; i < 5; i += 1) {
      const date = new Date(firstDate);
      date.setDate(i * 7 + 1);
      const week = getWeeks(date);
      result.push(...week);
    }
    return result;
  }

  const listOfHours = getHoursByUnit(
    TableTime.get().firstHour,
    TableTime.get().lastHour
  );

  const minutesUnit = 10; // 선택 가능한 분의 최소 단위. 10일 경우 10, 20, 30, 40, 50 분만 선택 가능
  const listOfMinutes = getMinutesByUnit(minutesUnit);

  /** 클릭한 날짜가 동일할 경우 callback을 실행한다. callback은 모달 닫는 함수를 전달한다 */
  const selectDay = (date: Date, callback: () => void) => {
    const { year, month, day } = inputDate;
    const isSame =
      +year === date.getFullYear() &&
      +month === date.getMonth() + 1 &&
      +day === date.getDate();
    if (isSame) return callback();

    setInputDate((prevState) => ({
      ...prevState,
      year: `${date.getFullYear()}`,
      month: `${date.getMonth() + 1}`,
      day: `${date.getDate()}`,
    }));
  };

  const displayedYearMonth = `${showMonthCalendar[15].getFullYear()}년 ${
    showMonthCalendar[15].getMonth() + 1
  }월`;

  const toggleDatepicker = () => {
    setOpen((prev) => !prev);
  };
  const closeDatepicker = () => {
    setOpen(false);
  };

  return (
    <div className="datepicker__calendar relative">
      <button
        onClick={toggleDatepicker}
        className="datepicker__calendar-icon cursor-pointer"
        ref={ref}
        type="button"
      >
        <Calendar />
      </button>
      {isOpen && (
        <ModalPortal left={left} top={top} closeAction={closeDatepicker}>
          <div className="datepicker__calendar-body absolute bottom-0 z-50 w-[440px]">
            <div className="absolute flex w-full flex-col rounded-md border bg-white p-3">
              <div className="mb-1 flex justify-between border-b pb-2">
                <div>{displayedYearMonth}</div>
                <div className="space-x-6">
                  <Buttons
                    attributes={[
                      {
                        onClick: () => changeShowMonth('decrement'),
                        children: <FontAwesomeIcon icon={faArrowUp} />,
                        inactivate: compareDateMatch(
                          showMonthCalendar[15],
                          today,
                          'ym'
                        ),
                      },
                      {
                        onClick: () => changeShowMonth('increment'),
                        children: <FontAwesomeIcon icon={faArrowDown} />,
                      },
                      {
                        onClick: () => changeShowMonth('thisMonth'),
                        children: '오늘',
                      },
                      {
                        onClick: () => setOpen(false),
                        children: '닫기',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="flex divide-x">
                <div className="grid w-full grid-cols-7 pr-1.5 text-center">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={`datepicker__calendar-day${day}`}>{day}</div>
                  ))}
                  {showMonthCalendar.map((day) => {
                    const dayNumber = day.getDay();
                    const selectedDate = new Date(
                      `${inputDate.year}-${inputDate.month}-${inputDate.day}`
                    );
                    const inactivate = day.getTime() < today.getTime();
                    return (
                      <Day
                        inactivate={inactivate}
                        key={day.valueOf()}
                        day={day.getDate()}
                        isToday={compareDateMatch(day, today, 'ymd')}
                        isSunday={dayNumber === 0}
                        isSaturday={dayNumber === 6}
                        isThisMonth={
                          day.getMonth() !== showMonthCalendar[15].getMonth()
                        }
                        isSelect={compareDateMatch(day, selectedDate, 'ymd')}
                        onClick={() => selectDay(day, closeDatepicker)}
                      />
                    );
                  })}
                </div>
                {hasHour && (
                  <div className="flex h-32 space-x-2 pl-2 text-center">
                    <TimeSelector
                      type="시"
                      numbers={listOfHours}
                      inputDate={inputDate}
                      setInputDate={setInputDate}
                      closeDatepicker={closeDatepicker}
                    />
                    <TimeSelector
                      type="분"
                      numbers={listOfMinutes}
                      inputDate={inputDate}
                      setInputDate={setInputDate}
                      closeDatepicker={closeDatepicker}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
