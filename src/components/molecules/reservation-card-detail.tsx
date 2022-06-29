import { getHHMM, getTimeLength, getYMD } from "../../libs/timetable-utils";
import { RESERVATION_STATE_KOR } from "../../variables";
import { IListReservation } from "../../store";
import { EditReservationState } from "./edit-reservation-state";

interface ReservationCardDetailProps {
  reservation: IListReservation;
}

export const ReservationCardDetail = ({
  reservation,
}: ReservationCardDetailProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative grid grid-cols-[5rem,1fr] items-center">
        <span className="">담당 치료사</span>
        <span>{reservation.user.name}</span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">예약시간</span>
        <span>{getYMD(reservation.startDate, "yyyymmdd", "-")}</span>
        <span className="col-start-2">
          {getHHMM(reservation.startDate, ":")} ~{" "}
          {getHHMM(reservation.endDate, ":")} (
          {getTimeLength(reservation.startDate, reservation.endDate, "minute")}
          분)
        </span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">처방</span>
        <span className="space-x-4">
          {reservation.prescriptions?.map((prescription, i) => (
            <span key={i}>{prescription.name}</span>
          ))}
        </span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">상태</span>
        <span className="flex justify-between pr-1">
          {RESERVATION_STATE_KOR[reservation.state]}
          <div className="space-x-4">
            <EditReservationState reservation={reservation} />
          </div>
        </span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">마지막 수정</span>
        <span>{reservation.lastModifier?.name}</span>
      </div>

      <div>
        <span className="">메모</span>
        <p className="pl-4">{reservation.memo}</p>
      </div>
    </div>
  );
};
