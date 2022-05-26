import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Clinic,
  ListReservationsQuery,
  Patient,
  Prescription,
  Reservation,
  User,
} from "../../../graphql/generated/graphql";
import {
  compareDateMatch,
  compareSameWeek,
  getSunday,
  getTimeGaps,
  getWeeks,
  DayWithUsers,
  injectUsers,
  spreadClinicMembers,
  ClinicMemberWithOptions,
} from "../../../libs/timetable-utils";
import {
  selectedClinicVar,
  clinicListsVar,
  todayNowVar,
  viewOptionsVar,
  selectedDateVar,
  loggedInUserVar,
} from "../../../store";
import { TimeIndicatorBar } from "./time-indicator-bar";
import { TableSubHeader } from "./table-sub-header";
import { TableRow } from "./table-row";
import { TableCols } from "./table-cols";

interface ITimeOption {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

interface ITimetableProps {
  tableTime: ITimeOption;
  eventsData?: ListReservationsQuery;
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

export const TimetableMain = ({ tableTime, eventsData }: ITimetableProps) => {
  const today = useReactiveVar(todayNowVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[]>([]);
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
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, "d") &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log("✅ 년월이 같고 일과 주가 다르다");
    }
    setPrevSelectedDate(selectedDate);
  }, [selectedDate]);

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      {viewOptions.seeList === false && (
        <>
          {viewOptions.periodToView === 7 && (
            <div className="h-full overflow-y-scroll">
              <TableSubHeader weekEvents={weekEvents} isWeek />
              <div className="body-table relative h-full">
                <TimeIndicatorBar labels={labels} />
                <div className="row-table absolute z-30 h-full w-full">
                  {labels.map((label) => (
                    <TableRow
                      key={label.valueOf()}
                      isWeek
                      label={label}
                      weekEvents={weekEvents}
                    />
                  ))}
                </div>
                <TableCols weekEvents={weekEvents} isWeek labels={labels} />
              </div>
            </div>
          )}
          {viewOptions.periodToView === 1 && (
            <div className="body-table relative h-full overflow-x-scroll pt-1.5">
              <TableSubHeader weekEvents={weekEvents} isWeek={false} />
              <TimeIndicatorBar labels={labels} />
              <div className="row-table absolute h-full w-full">
                {labels.map((label) => (
                  <TableRow
                    key={label.valueOf()}
                    isWeek={false}
                    label={label}
                    weekEvents={[weekEvents[selectedDate.getDay()]]}
                  />
                ))}
              </div>
              <TableCols
                weekEvents={[weekEvents[selectedDate.getDay()]]}
                isWeek={false}
                labels={labels}
              />
            </div>
          )}
        </>
      )}
      {viewOptions.seeList === true && "준비 중"}
      {/* {viewOptions.seeList === true &&
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
                    onClick={() => "나중에 고칠 것"}
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
                          onClick={() => "나중에 고칠 것"}
                        />
                      ))}
                    </div>
                  ))}
                </>
              ))}
            </div>
          )
        ))} */}
    </>
  );
};