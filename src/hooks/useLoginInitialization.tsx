import { useEffect, useState } from 'react';
import {
  ClinicType,
  MeQuery,
  useFindMyClinicsQuery,
} from '../graphql/generated/graphql';
import { loggedInUserVar, viewOptionsVar } from '../store';
import {
  IClinic,
  IClinicList,
  ISelectedClinic,
  IViewOption,
  LoggedInUser,
} from '../types/type';
import {
  getStorage,
  removeStorage,
  setStorage,
} from '../utils/localStorageUtils';
import { useMe } from './useMe';
import useStore, { makeSelectedClinic } from './useStore';

function useLoginInitialization() {
  const [loading, setLoading] = useState(true);
  const { data: meData } = useMe();
  const { setSelectedInfo, viewOptions, clinicListsVar } = useStore();
  const { data: findMyClinicsData } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  const setViewOption = (meData: NonNullable<LoggedInUser>) => {
    const localViewOptions = getStorage<IViewOption>({
      key: 'viewOption',
      userId: meData.id,
      userName: meData.name,
    });

    if (localViewOptions === null) {
      setStorage({
        key: 'viewOption',
        userId: meData.id,
        userName: meData.name,
        value: viewOptions.get,
      });
    } else {
      viewOptionsVar(localViewOptions);
    }
  };

  const setClinicLists = (meData: MeQuery, clinics: IClinic[]) => {
    function injectKeyValue(clinics: IClinic[]): IClinicList[] {
      return clinics.map((clinic) => {
        const members = clinic.members.map((member) => ({
          ...member,
          isActivate: member.staying,
        }));
        return { ...clinic, members };
      });
    }

    const myClinics = injectKeyValue(clinics);
    let updatedMyClinics: IClinicList[] = myClinics;

    const localClinics = getStorage<IClinicList[]>({
      key: 'clinicLists',
      userId: meData.me.id,
      userName: meData.me.name,
    });

    if (localClinics) {
      updatedMyClinics = myClinics.map((clinic) => {
        const localClinic = localClinics.find(
          (localClinic) => localClinic.id === clinic.id
        );

        if (!localClinic) return clinic;

        return {
          ...localClinic,
          id: clinic.id,
          name: clinic.name,
          type: clinic.type,
          members: clinic.members.map((member) => {
            const sameMember = localClinic.members.find(
              (localMember) => localMember.id === member.id
            );
            return {
              ...member,
              ...(sameMember && { isActivate: sameMember.isActivate }),
            };
          }),
        };
      });
    }

    setStorage({
      key: 'clinicLists',
      userId: meData.me.id,
      userName: meData.me.name,
      value: updatedMyClinics,
    });
    clinicListsVar(updatedMyClinics);

    return updatedMyClinics;
  };

  const setSelectedClinic = (updatedMyClinics: IClinicList[]) => {
    if (!meData) return console.error('loggedInUser가 없습니다');

    const localSelectClinic = getStorage<ISelectedClinic>({
      key: 'selectedClinic',
      userId: meData.me.id,
      userName: meData.me.name,
    });

    const existInClinicList = () => {
      return updatedMyClinics.find(
        (clinic) => clinic.id === localSelectClinic?.id
      );
    };
    let newSelectedClinic =
      existInClinicList() ||
      updatedMyClinics.find((clinic) => clinic.type === ClinicType.Personal);

    if (!newSelectedClinic) throw new Error('선택된 병원이 없습니다');

    setSelectedInfo(
      'clinic',
      makeSelectedClinic(newSelectedClinic, meData.me.id),
      () =>
        setStorage({
          key: 'selectedClinic',
          userId: meData.me.id,
          userName: meData.me.name,
          value: newSelectedClinic,
        })
    );
  };

  const checkLatestStorage = (loginUser: MeQuery['me']) => {
    let createdAt = getStorage<string | Date>({
      key: 'createdAt',
    });

    if (!createdAt) {
      return setStorage({ key: 'createdAt', value: new Date() });
    }

    createdAt = new Date(createdAt);
    const latestDateString = '2022-09-08T07:52:25.494Z';
    const latestCreatedAt = new Date(latestDateString);

    if (createdAt.getTime() > latestCreatedAt.getTime()) return;

    const user = { userId: loginUser.id, userName: loginUser.name };
    removeStorage({ ...user, key: 'clinicLists' });
    removeStorage({ ...user, key: 'viewOption' });
    removeStorage({ ...user, key: 'selectedClinic' });

    setStorage({
      key: 'createdAt',
      value: latestCreatedAt,
    });
    return console.info('Initialized Local Storage');
  };

  useEffect(() => {
    setLoading(true);
    if (
      !meData ||
      !findMyClinicsData ||
      !findMyClinicsData.findMyClinics.clinics
    )
      return;

    checkLatestStorage(meData.me);
    setViewOption(meData.me);

    loggedInUserVar(meData.me);
    setSelectedClinic(
      setClinicLists(meData, findMyClinicsData.findMyClinics.clinics)
    );
    setLoading(false);
  }, [meData, findMyClinicsData]);

  return { loading };
}

export default useLoginInitialization;
