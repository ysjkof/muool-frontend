import { LATEST_STORAGE_VERSION } from '../../constants/constants';
import { TimeDurationOfTimetable } from '../../models';
import {
  setClinicId,
  setHiddenUsers,
  setShowCancelOfTimetable,
  setShowNoshowOfTimetable,
  setTimeDurationOfTimetable,
  useStore,
} from '../../store';
import { localStorageUtils } from '../../utils/localStorage.utils';
import type { UserIdAndName } from '../../types/common.types';
import type { ClinicIdAndHiddenUsers } from '../../types/store.types';

export const checkAndRefreshLatestStorage = () => {
  if (isLatestStorage()) return;

  const { user } = useStore.getState();

  localStorageUtils.removeAll(user);

  localStorageUtils.set({
    key: 'createdAt',
    value: LATEST_STORAGE_VERSION,
  });
  return console.info('Refresh Local Storage');
};

const isLatestStorage = () => {
  const localCreatedAt = localStorageUtils.get<string>({
    key: 'createdAt',
  });

  const createdAt = localCreatedAt && new Date(localCreatedAt);
  console.log(
    createdAt && createdAt.getTime() >= LATEST_STORAGE_VERSION.getTime(),
    createdAt,
    LATEST_STORAGE_VERSION
  );

  return !!(
    createdAt && createdAt.getTime() >= LATEST_STORAGE_VERSION.getTime()
  );
};

export const initTimeDurationOfTimetable = (user: UserIdAndName) => {
  setTimeDurationOfTimetable(TimeDurationOfTimetable.initialize(user));
};

export const initPickedClinicId = (
  user: UserIdAndName,
  personalClinicId: number
) => {
  const clinicId = localStorageUtils.get<number>({
    key: 'pickedClinicId',
    ...user,
  });

  if (clinicId === null) return setClinicId(personalClinicId);

  setClinicId(clinicId);
};

export const initHiddenUsers = (user: UserIdAndName) => {
  const localStorageData = localStorageUtils.get<ClinicIdAndHiddenUsers[]>({
    key: 'hiddenUsers',
    ...user,
  });

  if (localStorageData === null) {
    return;
  }

  const clinicId = useStore.getState().pickedClinicId;
  const hiddenUsers = localStorageData.find(
    ([_clinicId]) => _clinicId === clinicId
  );
  if (!hiddenUsers) return;

  setHiddenUsers(hiddenUsers[1]);
};

export const loadShowCancel = (user: UserIdAndName) => {
  const value = localStorageUtils.get({
    key: 'showCancelOfTimetable',
    ...user,
  });
  setShowCancelOfTimetable(typeof value === 'boolean' || true);
};
export const loadShowNoshow = (user: UserIdAndName) => {
  const value = localStorageUtils.get({
    key: 'showNoshowOfTimetable',
    ...user,
  });
  setShowNoshowOfTimetable(typeof value === 'boolean' || true);
};
