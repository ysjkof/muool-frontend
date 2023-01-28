import { useState } from 'react';
import { USER_COLORS } from '../../../../constants/constants';
import { CheckableButton } from '../../../../components';
import { useSelectedClinic } from '../../hooks';
import { ClinicsOfClient } from '../../../../models';
import { ChevronLeft, ChevronRight } from '../../../../svgs';
import { cls } from '../../../../utils/common.utils';

const UserSelector = () => {
  const [isSpreading, setIsSpreading] = useState(false);
  const { toggleUser } = useSelectedClinic();
  const toggleUsers = (memberId: number) => {
    toggleUser(memberId);
  };

  return (
    <div className="flex basis-full items-center gap-2">
      <SpreadingToggleButton
        isSpreading={isSpreading}
        setIsSpreading={setIsSpreading}
      />
      {isSpreading && (
        <div className="flex flex-wrap items-center gap-2">
          {ClinicsOfClient.selectedClinic?.members.map((member, i) => (
            <CheckableButton
              key={i}
              personalColor={USER_COLORS[i].deep}
              canSee={!!member.canSee}
              label={member.user.name}
              onClick={() => toggleUsers(member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SpreadingToggleButtonProps {
  isSpreading: boolean;
  setIsSpreading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpreadingToggleButton = ({
  isSpreading,
  setIsSpreading,
}: SpreadingToggleButtonProps) => {
  const toggleSpreading = () => setIsSpreading((prev) => !prev);

  return (
    <button
      className={cls(
        'flex transform items-center justify-center gap-2 whitespace-nowrap rounded-full border py-1 px-4 text-base font-medium',
        isSpreading ? 'border-transparent text-cst-blue ring-2' : ''
      )}
      onClick={toggleSpreading}
      type="button"
    >
      <span>치료사 선택하기</span>
      {isSpreading ? <ChevronLeft className="stroke-2" /> : <ChevronRight />}
    </button>
  );
};

export default UserSelector;