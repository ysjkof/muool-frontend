import { useReactiveVar } from "@apollo/client";
import { ReactNode } from "react";
import { cls } from "../../../../libs/utils";
import { viewOptionsVar } from "../../../../store";
import { ONE_DAY } from "../../../../variables";

interface TableLoopLayoutProps {
  userLength: number;
  children: ReactNode;
  isUserCols?: boolean;
  isActiveBorderTop?: boolean;
  elementName?: string;
}
export function TableLoopLayout({
  userLength,
  children,
  elementName,
}: TableLoopLayoutProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      className={cls(
        elementName ? elementName : "",
        "grid w-full divide-x",
        userLength !== 1 ? "divide-blue-800" : ""
      )}
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns: `repeat(1, minmax(${
                userLength * 6
              }rem,1fr))`,
            }
          : {
              gridTemplateColumns: `repeat(7, minmax(${userLength * 6}rem,1fr)`,
            }
      }
    >
      {children}
    </div>
  );
}