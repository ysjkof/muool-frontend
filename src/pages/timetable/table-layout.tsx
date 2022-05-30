import { useReactiveVar } from "@apollo/client";
import { ListReservationsQuery } from "../../graphql/generated/graphql";
import { ReservationCard } from "./reservation-card";
import { todayNowVar, viewOptionsVar } from "../../store";
import { ModalPortal } from "../../components/modal-portal";
import { ReserveCard } from "./reserve-card";
import { PrescriptionWithSelect } from ".";
import { AnimatePresence, motion } from "framer-motion";
import { TableHeader } from "./components/table-header";
import { useMatch, useNavigate } from "react-router-dom";
import { TIMETABLE } from "../../variables";
import { TableMain } from "./components/table-main";
import { TableClinicSelector } from "./components/table-clinic-selector";
import { useEffect, useState } from "react";

interface ITimetableProps {
  eventsData: ListReservationsQuery;
  prescriptions: PrescriptionWithSelect[];
  refetch: () => void;
}

export const TimetableLayout = ({
  prescriptions,
  eventsData,
  refetch,
}: ITimetableProps) => {
  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const navigate = useNavigate();
  const today = useReactiveVar(todayNowVar);
  const viewOptions = useReactiveVar(viewOptionsVar);

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      <AnimatePresence>
        {isEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed top-0 left-0 z-40 h-screen w-screen bg-black/50"
          >
            <div
              className="modal-background absolute h-full w-full"
              onClick={() => isEdit && navigate(TIMETABLE)}
            />
            <ReservationCard refetch={refetch} />
          </motion.div>
        )}
      </AnimatePresence>
      {isReserve && (
        <ModalPortal
          closeAction={() => isReserve && navigate(TIMETABLE)}
          children={
            <ReserveCard
              prescriptions={prescriptions}
              refetch={refetch}
              closeAction={() => isReserve && navigate(TIMETABLE)}
            />
          }
        />
      )}
      <motion.div
        animate={{ opacity: 1 }}
        className="timetable-layout-container text-xs opacity-0"
      >
        <TableHeader today={today} />
        <div className="flex">
          <AnimatePresence>
            <TableMain eventsData={eventsData} />
            {viewOptions.seeActiveOption && <TableClinicSelector />}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};