import { useReactiveVar } from "@apollo/client";
import { getActiveUserLength } from "..";
import {
  combineYMDHM,
  compareDateMatch,
  compareNumAfterGetMinutes,
  DayWithUsers,
  getTimeLength,
} from "../../../libs/timetable-utils";
import { selectedClinicVar, selectedDateVar } from "../../../store";
import { TABLE_CELL_HEIGHT } from "../../../variables";
import { EventBox } from "../molecules/event-box";
import { ReserveBtn } from "../molecules/reserve-btn";
import { TableLoopLayout } from "./templates/table-loop-layout";
import { TimeIndicatorBar } from "./time-indicator-bar";

interface TableColsProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}
export function TableCols({ weekEvents, labels }: TableColsProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const userLength = getActiveUserLength(selectedClinic?.members);

  return (
    <TableLoopLayout
      elementName="TABLE_COLS"
      userLength={userLength}
      children={weekEvents.map((day, i) => (
        <div
          key={i}
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${userLength}, 1fr)`,
          }}
        >
          <TimeIndicatorBar
            isActive={compareDateMatch(day.date, selectedDate, "ymd")}
            labels={labels}
          />
          {day.users.map((member, userIndex) =>
            member.isActivate ? (
              <div
                key={member.id}
                className="USER_COL relative w-full border-x-[0.5px] hover:border-transparent hover:bg-gray-200/50"
              >
                {labels.map((label) => (
                  <ReserveBtn
                    key={label.getTime()}
                    userIndex={userIndex}
                    label={combineYMDHM(day.date, label)}
                    member={{ id: member.user.id, name: member.user.name }}
                    isActiveBorderTop={compareNumAfterGetMinutes(
                      label,
                      [0, 30]
                    )}
                  />
                ))}
                {member.events?.map((event) => (
                  <EventBox
                    key={event.id}
                    reservationId={event.id}
                    userIndex={userIndex}
                    reservationState={event.state}
                    memo={event.memo}
                    registrationNumber={event.patient.registrationNumber}
                    patientName={event.patient.name}
                    prescriptions={event.prescriptions ?? []}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    inset={`${
                      labels.findIndex((label) =>
                        compareDateMatch(label, new Date(event.startDate), "hm")
                      ) * TABLE_CELL_HEIGHT
                    }px 0%`}
                    height={`${
                      getTimeLength(event.startDate, event.endDate) * 2
                    }px`}
                  />
                ))}
              </div>
            ) : (
              ""
            )
          )}
        </div>
      ))}
    />
  );
}