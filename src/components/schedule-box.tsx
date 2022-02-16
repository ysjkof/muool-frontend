interface IScheduleBox {
  // gridRowStart: number;
  // gridRowEnd: number;
  hhmm: string;
  memo: string | null;
  startDate: string;
  endDate: string;
}

export const ScheduleBox: React.FC<IScheduleBox> = ({
  // gridRowStart,
  // gridRowEnd,
  hhmm,
  children,
  memo,
  startDate,
  endDate,
}) => {
  const onClick = () => {
    console.log("you click ScheduleBox");
  };
  return (
    <div
      className="group col-start-2 rounded-lg border px-2 mb-1 bg-white relative hover:cursor-pointer hover:border-transparent hover:ring-2 hover:ring-gray-900"
      // style={{
      //   gridRowStart,
      //   gridRowEnd,
      // }}
      id={hhmm}
      onClick={onClick}
    >
      {children}
      <span className="text-gray-600 text-sm">{memo}</span>
      <div className="right-4 absolute rounded-lg -bottom-3 hidden group-hover:block border text-gray-500 px-4 bg-white">
        {startDate}~{endDate}
      </div>
    </div>
  );
};