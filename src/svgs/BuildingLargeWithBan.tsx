import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const BuildingLargeWithBan = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="66"
      height="66"
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={2}
      stroke="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-20 w-20' : '',
        iconSize === 'MD' ? 'h-18 w-18' : '',
        iconSize === 'SM' ? 'h-6 w-6' : ''
      )}
    >
      <path d="M54.4825 10.6722L10.6722 54.4825L12.0864 55.8968L55.8968 12.0864L54.4825 10.6722ZM65 33C65 50.6731 50.6731 65 33 65C15.3269 65 1 50.6731 1 33C1 15.3269 15.3269 1 33 1C50.6731 1 65 15.3269 65 33Z" />
      <path d="M15.3215 48.3215H53.0358" />
      <path d="M15.3215 48.3215H53.0358" />
      <path d="M15.3215 48.3215H53.0358" />
      <path d="M18.3027 47.7394V15.9429C18.3027 15.3906 18.7504 14.9429 19.3027 14.9429H38.1733C38.7256 14.9429 39.1733 15.3906 39.1733 15.9429V47.7394" />
      <path d="M18.3027 47.7394V15.9429C18.3027 15.3906 18.7504 14.9429 19.3027 14.9429H38.1733C38.7256 14.9429 39.1733 15.3906 39.1733 15.9429V47.7394" />
      <path d="M18.3027 47.7394V15.9429C18.3027 15.3906 18.7504 14.9429 19.3027 14.9429H38.1733C38.7256 14.9429 39.1733 15.3906 39.1733 15.9429V47.7394" />
      <path d="M42.4285 33H47.6299C48.6627 33 49.4999 33.8372 49.4999 34.87V48.3214" />
      <path d="M42.4285 33H47.6299C48.6627 33 49.4999 33.8372 49.4999 34.87V48.3214" />
      <path d="M42.4285 33H47.6299C48.6627 33 49.4999 33.8372 49.4999 34.87V48.3214" />
      <path d="M27.4858 23.9927L30.3481 23.9927" />
      <path d="M27.4858 23.9927L30.3481 23.9927" />
      <path d="M27.4858 23.9927L30.3481 23.9927" />
      <path d="M28.9167 22.5615L28.9167 25.4238" />
      <path d="M28.9167 22.5615L28.9167 25.4238" />
      <path d="M28.9167 22.5615L28.9167 25.4238" />
      <path d="M31.8752 32.3267L25.9122 32.3267" />
      <path d="M31.8752 32.3267L25.9122 32.3267" />
      <path d="M31.8752 32.3267L25.9122 32.3267" />
      <path d="M30.6428 35.9048L25.9122 35.9048" />
      <path d="M30.6428 35.9048L25.9122 35.9048" />
      <path d="M30.6428 35.9048L25.9122 35.9048" />
      <path d="M31.8215 47.9915L31.8215 40.0715L27.1072 40.0715M25.9287 48.3215L25.9287 41.2501" />
      <path d="M31.8215 47.9915L31.8215 40.0715L27.1072 40.0715M25.9287 48.3215L25.9287 41.2501" />
      <path d="M31.8215 47.9915L31.8215 40.0715L27.1072 40.0715M25.9287 48.3215L25.9287 41.2501" />
      <rect
        x="24.9287"
        y="20.2144"
        width="7.89286"
        height="7.89286"
        rx="2"
        strokeWidth="2"
      />
    </svg>
  );
};

export default BuildingLargeWithBan;
