import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import ReserveForm from './ReserveForm';
import CreatePatientForm from './CreatePatientForm';
import ReservationNameCard from './ReservationNameCard';
import ReservationCardDetail from './ReservationCardDetail';
import BtnMenuToggle from '../../../../_legacy_components/molecules/MenuToggleButton';
import MenuButton from '../../../../_legacy_components/molecules/MenuButton';
import { GENDER_KOR } from '../../../../constants/constants';
import { useDeleteReservation } from '../../hooks';
import Loading from '../../../../_legacy_components/atoms/Loading';
import type { ReservationInList } from '../../../../types/common.types';
import type { CloseAction } from '../../../../types/props.types';

interface ReservationCardProps extends CloseAction {
  reservation: ReservationInList;
}

export default function ReservationCard({
  closeAction,
  reservation,
}: ReservationCardProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [menu, setMenu] = useState<'reservation' | 'patient'>('reservation');

  const { deleteReservation } = useDeleteReservation();
  const invokeDelete = () => {
    const reservationId = reservation.id;
    deleteReservation({ reservationId, closeAction });
  };

  const changeMenu = (type: typeof menu) => {
    setMenu(type);
    setIsEdit(false);
  };

  const toggleMenu = () => {
    setMenu((prev) => (prev === 'reservation' ? 'patient' : 'reservation'));
    setIsEdit(false);
  };

  if (!reservation.patient) return <Loading />;
  const { patient, user, clinic, memo } = reservation;
  return (
    <div className="space-y-4">
      <ReservationNameCard
        birthday={patient.birthday}
        gender={patient.gender as keyof typeof GENDER_KOR}
        name={patient.name}
        registrationNumber={patient.registrationNumber}
      />
      <BtnMenuToggle
        firstEnabled={menu === 'reservation'}
        secondEnabled={menu === 'patient'}
        label={['예약', '환자정보']}
        width="full"
        onClick={toggleMenu}
      />
      <div className="reservation-editor flex justify-around">
        <MenuButton
          enabled={!isEdit && menu === 'reservation'}
          onClick={!isEdit && menu === 'reservation' ? invokeDelete : undefined}
        >
          <FontAwesomeIcon icon={faTrashCan} fontSize={14} />
          삭제
        </MenuButton>
        <MenuButton enabled={isEdit} onClick={() => setIsEdit((prev) => !prev)}>
          <FontAwesomeIcon icon={faEdit} fontSize={14} />
          수정
        </MenuButton>
      </div>
      <div className="h-full overflow-y-scroll">
        {menu === 'reservation' && !isEdit && (
          <ReservationCardDetail reservation={reservation} />
        )}
        {menu === 'reservation' && isEdit && (
          <ReserveForm
            userId={user.id}
            closeAction={() => changeMenu('reservation')}
            reservation={reservation}
          />
        )}

        {menu === 'patient' && !isEdit && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="">메모</span>
              <p className="pl-4">{memo}</p>
            </div>
          </div>
        )}
        {menu === 'patient' && isEdit && (
          // 할일: 선택된환자 형태로 가공하는 메서드
          <CreatePatientForm
            patient={{ ...patient, user, clinic }}
            closeAction={() => null}
          />
        )}
      </div>
    </div>
  );
}
