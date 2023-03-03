import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWindowSize } from '../../../hooks';
import { useStore } from '../../../store';
import type { TimetableTemplateProps } from '../../../types/propsTypes';

const TimetableTemplate = ({
  nav,
  labels,
  columns,
}: TimetableTemplateProps) => {
  const isBigGlobalAside = useStore((state) => state.isBigGlobalAside);

  const { height, width, changeHeight, changeWidth } = useWindowSize(true);
  const navRef = useRef<HTMLDivElement>(null);
  const extraMargin = 20;

  useEffect(() => {
    if (!navRef.current) return;
    changeHeight(navRef.current.clientHeight);
    changeWidth();
  }, [isBigGlobalAside]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      id="timetable__template"
      className="flex h-full w-full flex-col text-xs opacity-0"
    >
      <div
        id="timetable__nav"
        className="relative z-[34] mt-4 px-2"
        ref={navRef}
      >
        {nav}
      </div>
      <div
        id="timetable__body"
        className="flex overflow-y-scroll"
        style={{
          height: `${height - extraMargin}px`,
          width: `${width}px`,
        }}
      >
        <div
          id="timetable__labels"
          className="sticky left-0 z-[32] bg-white pt-[73px]"
        >
          {labels}
        </div>
        <div id="timetable__columns" className="w-full">
          {columns}
        </div>
      </div>
    </motion.div>
  );
};

export default TimetableTemplate;
