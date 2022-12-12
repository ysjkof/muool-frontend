import { ButtonHTMLAttributes, useState, type PropsWithChildren } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { set, setDay } from 'date-fns';
import { Modal } from '../../../../components';
import { selectedDateVar } from '../../../../store';
import { cls } from '../../../../utils/common.utils';
import { FormForReservation } from '../FormForReservation';
import type { IsActive, LocationState } from '../../../../types/common.types';
import type { CloseAction } from '../../../../types/props.types';

const ReserveOrDayoff = ({ closeAction }: CloseAction) => {
  const location = useLocation();
  const {
    startDate: { hours, minutes, dayIndex },
    userId,
    isDayoff,
  }: LocationState = location.state;

  const [isReserve, setIsReserve] = useState(!isDayoff);

  const selectedDate = useReactiveVar(selectedDateVar);
  const date = setDay(set(selectedDate, { hours, minutes }), dayIndex);

  const seeReserve = () => setIsReserve(true);
  const seeDayoff = () => setIsReserve(false);

  return (
    <Modal closeAction={closeAction}>
      <div className="w-96 rounded-sm border">
        <Navigation>
          <Tab isActive={isReserve} onClick={seeReserve}>
            환자예약
          </Tab>
          <Tab isActive={!isReserve} onClick={seeDayoff}>
            예약잠금
          </Tab>
        </Navigation>
        {isReserve ? (
          <FormForReservation
            closeAction={closeAction}
            date={date}
            userId={userId}
          />
        ) : (
          <div>dayoff component</div>
        )}
      </div>
    </Modal>
  );
};

export default ReserveOrDayoff;

const Navigation = ({ children }: PropsWithChildren) => {
  return <div className="flex">{children}</div>;
};

interface TapProps
  extends PropsWithChildren,
    IsActive,
    ButtonHTMLAttributes<HTMLButtonElement> {}

const Tab = ({ isActive, children, ...args }: TapProps) => {
  return (
    <button
      className={cls(
        'h-14 w-full text-xl font-medium ',

        isActive ? 'text-cst-blue' : 'bg-table-bg text-font-gray'
      )}
      type="button"
      {...args}
    >
      {children}
    </button>
  );
};
