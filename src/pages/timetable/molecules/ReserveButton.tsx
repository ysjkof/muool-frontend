import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateReservationMutation } from '../../../graphql/generated/graphql';
import { getHHMM, getTimeLength } from '../../../services/dateServices';
import { selectedInfoVar } from '../../../store';
import { TABLE_CELL_HEIGHT, USER_COLORS } from '../../../constants/constants';
import { ROUTER } from '../../../router/routerConstants';
import { IListReservation } from '../../../types/type';

interface ReserveBtnProps {
  label: Date;
  member: { id: number; name: string };
  userIndex: number;
  isActiveBorderTop?: boolean;
}

function getPrescriptionInfo(reservation: IListReservation) {
  type ReturnType = {
    prescriptionIds: number[];
    requiredTime: number;
  };
  const reduceReturnType: ReturnType = {
    prescriptionIds: [],
    requiredTime: 0,
  };
  const { prescriptionIds, requiredTime } = reservation.prescriptions!.reduce(
    (acc, prescription) => {
      return {
        prescriptionIds: [...acc.prescriptionIds, prescription.id],
        requiredTime: acc.requiredTime + prescription.requiredTime,
      };
    },
    reduceReturnType
  );
  return { prescriptionIds, requiredTime };
}

export const ReserveButton = ({
  label,
  member,
  userIndex,
  isActiveBorderTop = false,
}: ReserveBtnProps) => {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const [createReservationMutation, { loading }] =
    useCreateReservationMutation();

  const clearSelectedReservation = () => {
    selectedInfoVar({ ...selectedInfo, reservation: null });
  };
  return (
    <div
      className={`reserve-btn-box group ${
        isActiveBorderTop ? ' border-t border-gray-200 first:border-t-0' : ''
      }`}
      onMouseOver={(e) => {
        if (selectedInfo.reservation) setIsHover(true);
      }}
      onMouseLeave={(e) => {
        if (selectedInfo.reservation) setIsHover(false);
      }}
      onClick={() => {
        if (selectedInfo.reservation) {
          if (loading) return;
          const { prescriptionIds, requiredTime } = getPrescriptionInfo(
            selectedInfo.reservation
          );

          const endDate = new Date(label);
          endDate.setMinutes(endDate.getMinutes() + requiredTime);

          createReservationMutation({
            variables: {
              input: {
                clinicId: selectedInfo.reservation.clinic!.id,
                patientId: selectedInfo.reservation.patient!.id,
                memo: selectedInfo.reservation.memo,
                userId: member.id,
                startDate: label,
                endDate,
                prescriptionIds,
              },
            },
          });
          // 할일: 연속예약을 하기 위해서 키보드 조작으로 아래 동작 안하기
          clearSelectedReservation();
        } else {
          navigate(ROUTER.RESERVE, {
            state: { startDate: label, member },
          });
        }
      }}
    >
      <span className="reserve-btn">+ {getHHMM(label, ':')}</span>
      {selectedInfo.reservation && isHover && (
        <div
          className="absolute top-0 w-full border-2"
          style={{
            borderColor: USER_COLORS[userIndex]?.deep ?? 'black',
            height:
              getTimeLength(
                selectedInfo.reservation.startDate,
                selectedInfo.reservation.endDate,
                '20minute'
              ) *
                TABLE_CELL_HEIGHT +
              'px',
          }}
        />
      )}
    </div>
  );
};
