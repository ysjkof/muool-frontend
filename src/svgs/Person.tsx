import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const Person = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-6 w-6' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        d="M31.7583 9.19653H30.3208V7.75903C30.3208 7.37778 30.1694 7.01215 29.8998 6.74257C29.6302 6.47298 29.2645 6.32153 28.8833 6.32153C28.5021 6.32153 28.1364 6.47298 27.8668 6.74257C27.5973 7.01215 27.4458 7.37778 27.4458 7.75903V9.19653H26.0083C25.6271 9.19653 25.2614 9.34798 24.9918 9.61757C24.7223 9.88715 24.5708 10.2528 24.5708 10.634C24.5708 11.0153 24.7223 11.3809 24.9918 11.6505C25.2614 11.9201 25.6271 12.0715 26.0083 12.0715H27.4458V13.509C27.4458 13.8903 27.5973 14.2559 27.8668 14.5255C28.1364 14.7951 28.5021 14.9465 28.8833 14.9465C29.2645 14.9465 29.6302 14.7951 29.8998 14.5255C30.1694 14.2559 30.3208 13.8903 30.3208 13.509V12.0715H31.7583C32.1395 12.0715 32.5052 11.9201 32.7748 11.6505C33.0444 11.3809 33.1958 11.0153 33.1958 10.634C33.1958 10.2528 33.0444 9.88715 32.7748 9.61757C32.5052 9.34798 32.1395 9.19653 31.7583 9.19653Z"
        fill="white"
      />
      <path
        d="M15.125 16.3839C16.2622 16.3839 17.3739 16.0467 18.3195 15.4149C19.2651 14.783 20.0021 13.885 20.4373 12.8343C20.8725 11.7837 20.9864 10.6275 20.7645 9.51214C20.5427 8.39675 19.995 7.3722 19.1909 6.56805C18.3867 5.7639 17.3622 5.21626 16.2468 4.9944C15.1314 4.77253 13.9752 4.8864 12.9246 5.32161C11.8739 5.75681 10.9759 6.4938 10.344 7.43938C9.71223 8.38497 9.375 9.49667 9.375 10.6339C9.375 12.1589 9.9808 13.6214 11.0591 14.6998C12.1375 15.7781 13.6 16.3839 15.125 16.3839Z"
        fill="white"
      />
      <path
        d="M23.9258 29.3214C24.3148 29.3214 24.6879 29.1808 24.963 28.9304C25.2381 28.6801 25.3926 28.3406 25.3926 27.9866C25.3926 25.5085 24.3109 23.1318 22.3853 21.3795C20.4597 19.6273 17.848 18.6428 15.1248 18.6428C12.4016 18.6428 9.78992 19.6273 7.86432 21.3795C5.93872 23.1318 4.85693 25.5085 4.85693 27.9866C4.85693 28.3406 5.01147 28.6801 5.28656 28.9304C5.56165 29.1808 5.93474 29.3214 6.32377 29.3214"
        fill="white"
      />
    </svg>
  );
};

export default Person;
