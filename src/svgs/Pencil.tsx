import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const Pencil = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-6 w-6' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        d="M1.83319 19H1.93819L6.80319 18.5567C7.33612 18.5036 7.83457 18.2688 8.21486 17.8917L18.7149 7.3917C19.1224 6.96117 19.3426 6.38663 19.3273 5.794C19.312 5.20136 19.0624 4.63896 18.6332 4.23004L15.4365 1.03337C15.0193 0.641483 14.4726 0.416623 13.9004 0.401565C13.3282 0.386507 12.7704 0.582302 12.3332 0.951704L1.83319 11.4517C1.45608 11.832 1.22128 12.3304 1.16819 12.8634L0.666525 17.7284C0.650808 17.8992 0.672981 18.0715 0.731463 18.2328C0.789944 18.3941 0.883294 18.5406 1.00486 18.6617C1.11387 18.7698 1.24316 18.8554 1.3853 18.9134C1.52744 18.9715 1.67965 19.0009 1.83319 19V19ZM13.8149 2.6667L16.9999 5.8517L14.6665 8.1267L11.5399 5.00004L13.8149 2.6667ZM3.43152 13.0617L9.99986 6.54004L13.1499 9.69004L6.61652 16.2234L3.11652 16.55L3.43152 13.0617Z"
        fill="#8D8DAD"
      />
    </svg>
  );
};

export default Pencil;
