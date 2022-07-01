import { useReactiveVar } from "@apollo/client";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  ListReservationsDocument,
  useCreateDayOffMutation,
} from "../../../graphql/generated/graphql";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import { RESERVE_DETAIL, USER_COLORS } from "../../../variables";

interface NameInSubHeaderProps {
  isMe: boolean;
  name: string;
  userIndex: number;
  clinicId: number;
  userId: number;
  date: Date;
}

export const NameInSubHeader = ({
  isMe,
  name,
  userIndex,
  clinicId,
  userId,
  date,
}: NameInSubHeaderProps) => {
  const [createDayOff, { loading }] = useCreateDayOffMutation();
  const viewOptions = useReactiveVar(viewOptionsVar);
  const navigate = useNavigate();

  function onClickBox() {
    navigate(RESERVE_DETAIL, { state: { isDayOff: true } });
  }

  function lockTable() {
    if (loading) return;

    const { start, end } = viewOptions.tableDuration;
    const startDate = new Date(date);
    const endDate = new Date(date);
    startDate.setHours(start.hours, start.minutes);
    endDate.setHours(end.hours, end.minutes);

    createDayOff({
      variables: {
        input: {
          startDate,
          endDate,
          clinicId,
          userId,
        },
      },
      refetchQueries: [{ query: ListReservationsDocument }, "listReservations"],
    });
  }
  return (
    <div
      className={cls(
        "border-r-[0.5] group flex w-full items-center justify-center py-0.5 last:border-r-0",
        isMe ? " font-semibold" : ""
      )}
    >
      <span
        className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: USER_COLORS[userIndex]?.deep }}
      />
      {name}
      <div className="POPOVER absolute top-4 flex flex-col border bg-white">
        <div className="hidden  whitespace-nowrap  group-hover:block">
          <div
            className="flex cursor-pointer items-center gap-1 py-1 px-2 hover:bg-gray-200"
            onClick={lockTable}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>예약잠금(종일)</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 py-1 px-2 hover:bg-gray-200"
            onClick={onClickBox}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>예약잠금</span>
          </div>
        </div>
      </div>
    </div>
  );
};
