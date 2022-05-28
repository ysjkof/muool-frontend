import { useReactiveVar } from "@apollo/client";
import {
  compareNumAfterGetMinutes,
  DayWithUsers,
  getHHMM,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import { ONE_DAY } from "../../../variables";
import { ReserveBtn } from "./reserve-btn";

interface TableRowProps {
  label: Date;
  weekEvents: DayWithUsers[];
}

export function TableRow({ label, weekEvents }: TableRowProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  if (!weekEvents[0]) {
    // console.log("❌ weekEvents[0]가 false입니다 : ", weekEvents);
    return <h2>Loading...</h2>;
  }
  const userLength = weekEvents[0].users.length;
  return (
    <div
      className={cls(
        "grid h-5 w-full divide-x-2 divide-black",
        compareNumAfterGetMinutes(label, [0, 30]) ? "border-t border-white" : ""
      )}
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns: `2.5rem repeat(1, minmax(${
                userLength * 6
              }rem,1fr))`,
            }
          : {
              gridTemplateColumns: `2.5rem repeat(7, minmax(${
                userLength * 6
              }rem,1fr)`,
            }
      }
    >
      <div
        className={cls(
          "title-col relative -top-2.5",
          compareNumAfterGetMinutes(label, [0, 30]) ? "bg-white" : ""
        )}
      >
        {compareNumAfterGetMinutes(label, [0, 30]) ? getHHMM(label) : ""}
      </div>
      {weekEvents.map((day, i) => (
        <div key={i} className={cls("relative z-30 flex")}>
          {day?.users.map(
            (member, userIndex) =>
              member.activation && (
                <ReserveBtn
                  key={userIndex}
                  label={label}
                  userIndex={userIndex}
                  member={{ id: member.user.id, name: member.user.name }}
                />
              )
          )}
        </div>
      ))}
    </div>
  );
}
