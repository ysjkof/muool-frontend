import { forwardRef, HtmlHTMLAttributes, ReactNode } from 'react';
import { cls } from '../../utils/utils';

interface BtnMenuProps {
  onClick?: any;
  children?: ReactNode;
  enabled?: boolean;
  isWidthFull?: boolean;
  hasBorder?: boolean;
  hasActiveRing?: boolean;
  hasFocus?: boolean;
  thinFont?: boolean;
  type?: 'button' | 'reset' | 'submit';
  isCenter?: boolean;
}

export default forwardRef<HTMLButtonElement, BtnMenuProps>(function MenuButton(
  {
    onClick,
    children,
    enabled,
    isWidthFull,
    hasBorder,
    hasActiveRing,
    hasFocus,
    thinFont,
    type = 'button',
    isCenter,
  },
  ref
) {
  return (
    <button
      type={type}
      className={cls(
        'btn-menu flex items-center gap-1 whitespace-nowrap',
        hasBorder ? 'border-gray-300' : '',
        enabled
          ? hasActiveRing
            ? 'emphasize-ring  border-transparent font-semibold'
            : 'font-semibold'
          : 'opacity-50',
        isWidthFull ? 'w-full' : '',
        thinFont ? 'py-0 text-[0.7rem] font-normal' : '',
        isCenter ? 'mx-auto text-center' : '',
        onClick ? '' : 'pointer-events-none cursor-default hover:bg-inherit',
        hasFocus ? 'focus:emphasize-ring' : ''
      )}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});
