import { makeVar } from "@apollo/client";
import { INameTag } from "./components/name-tag";
import { ListReservationsQuery } from "./graphql/generated/graphql";
import { GroupWithOptions, IViewOption } from "./libs/timetable-utils";

// 이곳에서 전역 변수 관리

export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export const listReservationRefetchVar = makeVar<any>(undefined);

export const selectedPatientVar = makeVar<null | INameTag>(null);

export const todayVar = makeVar<Date>(new Date());

export const colorsArr = [
  { name: "Orange Yellow Crayola", hex: "F4D06F", rgb: "244, 208, 111" },
  { name: "Dark Orange", hex: "FF8811", rgb: "255, 136, 17" },
  { name: "Middle Blue green", hex: "9DD9D2", rgb: "157, 217, 210" },
  { name: "Floral White", hex: "FFF8F0", rgb: "255,248,240" },
  { name: "Space Cadet", hex: "392F5A", rgb: "57,47,90" },
];

export const colorsObj = {
  yellow: {
    50: { hex: "#FEFCE8", rgb: "rgb(254, 252, 232)" },
    300: { hex: "#FDE047", rgb: "rgb(253, 224, 71)" },
  },
  red: {
    50: { hex: "#FEF2F2", rgb: "rgb(254, 242, 242)" },
    300: { hex: "#FCA5A5", rgb: "rgb(252, 165, 165)" },
  },
};

export const groupListsVar = makeVar<GroupWithOptions[] | null>(null);

export const viewOptionsVar = makeVar<IViewOption | null>(null);

export interface FocusGroup {
  id: number;
  name: string;
}

export const focusGroupVar = makeVar<FocusGroup | null>(null);
