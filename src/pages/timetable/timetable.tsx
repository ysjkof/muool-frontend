import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Clinic,
  ListReservationsQuery,
  Patient,
  Prescription,
  Reservation,
  User,
} from "../../graphql/generated/graphql";
import {
  compareDateMatch,
  compareSameWeek,
  getSunday,
  getTimeGaps,
  getWeeks,
  getWeeksOfMonth,
  DayWithUsers,
  injectUsers,
  spreadClinicMembers,
  ClinicMemberWithOptions,
  getHHMM,
} from "../../libs/timetable-utils";
import { ReservationDetail } from "./reservation-detail";
import {
  selectedClinicVar,
  clinicListsVar,
  todayNowVar,
  viewOptionsVar,
  selectedDateVar,
  loggedInUserVar,
} from "../../store";
import { ModalPortal } from "../../components/modal-portal";
import { Reserve } from "./reserve";
import { TimeIndicatorBar } from "./components/time-indicator-bar";
import { PrescriptionWithSelect } from ".";
import { EventLi } from "./components/event-li";

import { TableHeader } from "./components/table-header";
import { TableSubHeader } from "./components/table-sub-header";
import { TableRow } from "./components/table-row";
import { TableCols } from "./components/table-cols";
import { motion } from "framer-motion";
import { TableNav } from "./components/table-nav";

interface ITimeOption {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

interface ITimetableProps {
  tableTime: ITimeOption;
  eventsData?: ListReservationsQuery;
  prescriptions: PrescriptionWithSelect[];
  refetch: () => void;
}
export interface ModifiedReservation
  extends Pick<Reservation, "id" | "startDate" | "endDate" | "state" | "memo"> {
  user: Pick<User, "id" | "name">;
  lastModifier?: Pick<User, "id" | "name" | "email"> | null;
  patient: Pick<
    Patient,
    "id" | "name" | "gender" | "registrationNumber" | "birthday"
  >;
  clinic?: Pick<Clinic, "id" | "name"> | null;
  prescriptions?: Pick<Prescription, "name">[] | null;
}

export const Timetable = ({
  tableTime,
  eventsData,
  prescriptions,
  refetch,
}: ITimetableProps) => {
  const today = useReactiveVar(todayNowVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[]>([]);
  const [weeks, setWeeks] = useState<{ date: Date }[]>(
    getWeeks(getSunday(today))
  );
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(today);

  const labels = getTimeGaps(
    tableTime.start.hours,
    tableTime.start.minutes,
    tableTime.end.hours,
    tableTime.end.minutes,
    10
  );
  const clinicLists = useReactiveVar(clinicListsVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  const [openEventModal, setOpenEventModal] = useState<boolean>(false);
  const [eventIdForModal, setEventIdForModal] = useState<number | null>(null);
  const onClickEventBox = (eventId: number) => {
    setEventIdForModal(eventId);
    setOpenEventModal(true);
  };
  const [openReserveModal, setOpenReserveModal] = useState<boolean>(false);
  const [eventStartDate, setEventStartDate] = useState<Date>();

  function distributor(
    events: ModifiedReservation[] | undefined | null,
    members: ClinicMemberWithOptions[]
  ) {
    if (!loggedInUser) return;
    let days = injectUsers(
      getWeeks(getSunday(selectedDate)),
      loggedInUser,
      members
    );
    events?.forEach((event) => {
      const dateIndex = days.findIndex((day) =>
        compareDateMatch(day.date, new Date(event.startDate), "ymd")
      );
      if (dateIndex !== -1) {
        const userIndex = days[dateIndex].users.findIndex(
          (member) => member.user.id === event.user.id
        );
        if (userIndex !== -1) {
          days[dateIndex].users[userIndex].events.push(event);
        }
      }
    });
    return days;
  }
  useEffect(() => {
    if (eventsData?.listReservations.ok && loggedInUser) {
      const distributeEvents = distributor(
        eventsData.listReservations.results,
        spreadClinicMembers(clinicLists, selectedClinic.id)
      );
      if (distributeEvents) {
        setWeekEvents(distributeEvents);
      } else {
        console.error(
          "❌ distributeEvents를 알 수 없습니다 : ",
          distributeEvents
        );
      }
    } else {
      console.warn("✅ 시간표 > useEffect 실패");
    }
  }, [eventsData, clinicLists]);

  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, "ym")) {
      console.log("✅ 년월이 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, "d") &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log("✅ 년월이 같고 일과 주가 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
    }
    setPrevSelectedDate(selectedDate);
  }, [selectedDate]);

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        className="timetable-container h-full w-full text-xs"
      >
        <TableNav today={today} daysOfMonth={getWeeksOfMonth(today)} />
        {viewOptions.seeList === false && (
          <>
            {viewOptions.periodToView === 7 && (
              <>
                <TableHeader weeks={weeks} />
                <TableSubHeader weekEvents={weekEvents} isWeek />
                <div className="body-table relative h-full overflow-y-scroll pt-1.5">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute z-30 h-full w-full">
                    {labels.map((label) => (
                      <TableRow
                        key={label.valueOf()}
                        isWeek
                        label={label}
                        weekEvents={weekEvents}
                        setOpenReserveModal={setOpenReserveModal}
                        setEventStartDate={setEventStartDate}
                      />
                    ))}
                  </div>
                  <TableCols
                    weekEvents={weekEvents}
                    isWeek
                    labels={labels}
                    onClick={onClickEventBox}
                  />
                </div>
              </>
            )}
            {viewOptions.periodToView === 1 && (
              <>
                <TableHeader weeks={weeks} />
                <TableSubHeader weekEvents={weekEvents} isWeek={false} />
                <div className="body-table relative h-full overflow-x-scroll pt-1.5">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute h-full w-full">
                    {labels.map((label) => (
                      <TableRow
                        key={label.valueOf()}
                        isWeek={false}
                        label={label}
                        weekEvents={[weekEvents[selectedDate.getDay()]]}
                        setOpenReserveModal={setOpenReserveModal}
                        setEventStartDate={setEventStartDate}
                      />
                    ))}
                  </div>
                  <TableCols
                    weekEvents={[weekEvents[selectedDate.getDay()]]}
                    isWeek={false}
                    labels={labels}
                    onClick={onClickEventBox}
                  />
                </div>
              </>
            )}
          </>
        )}
        {viewOptions.seeList === true &&
          (viewOptions.periodToView === 1 ? (
            <div className="event-col relative grid border-x border-black">
              <div>
                {selectedDate.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>
              {weekEvents[selectedDate.getDay()].users?.map((user) => (
                <div key={user.id}>
                  {user.events?.map((event) => (
                    <EventLi
                      key={event.id}
                      viewOptions={viewOptions}
                      reservationState={event.state}
                      startDate={getHHMM(event.startDate, ":")}
                      patientName={event.patient.name}
                      userName={user.user.name}
                      onClick={() => onClickEventBox(event.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            viewOptions.periodToView === 7 && (
              <div className="event-col relative grid border-x border-black">
                {weekEvents.map((week) => (
                  <>
                    <div>
                      {week.date.toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </div>
                    {week.users?.map((user) => (
                      <div key={user.id}>
                        {user.events?.map((event) => (
                          <EventLi
                            key={event.id}
                            viewOptions={viewOptions}
                            reservationState={event.state}
                            startDate={getHHMM(event.startDate, ":")}
                            patientName={event.patient.name}
                            userName={user.user.name}
                            onClick={() => onClickEventBox(event.id)}
                          />
                        ))}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            )
          ))}
      </motion.div>
      {openEventModal && (
        <ModalPortal
          closeAction={setOpenEventModal}
          children={
            <ReservationDetail
              reservationId={eventIdForModal!}
              closeAction={setOpenEventModal}
              refetch={refetch}
              selectedClinic={selectedClinic}
            />
          }
        />
      )}
      {openReserveModal && (
        <ModalPortal
          closeAction={setOpenReserveModal}
          children={
            <Reserve
              startDate={eventStartDate!}
              closeAction={setOpenReserveModal}
              prescriptions={prescriptions}
              refetch={refetch}
            />
          }
        />
      )}
    </>
  );
};
