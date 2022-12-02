import type { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { cls } from '../../utils/common.utils';
import type { CloseAction } from '../../types/props.types';

interface ModalTemplateProps extends CloseAction, PropsWithChildren {
  closeAction: () => void;
  top?: number;
  left?: number;
  isSmallChildren?: boolean;
}

export default function ModalTemplate({
  children,
  closeAction,
  top,
  left,
  isSmallChildren,
}: ModalTemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className={cls(
        'modal-parents',
        top ? '' : ' flex items-center justify-center'
      )}
    >
      <div
        className={cls(
          'modal-background',
          top ? 'bg-transparent opacity-100' : ''
        )}
        onClick={closeAction}
        onKeyDown={closeAction}
        role="button"
        tabIndex={-1}
      />
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={false}
        className={cls(
          top ? 'relative' : 'modal-content h-full w-[400px] py-4 sm:h-fit',
          isSmallChildren ? '' : 'sm:min-h-[600px]'
        )}
        style={{ ...(top && { top, left }) }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
