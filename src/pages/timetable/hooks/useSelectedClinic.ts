import { ClinicsOfClient } from '../../../models';

export const useSelectedClinic = () => {
  const toggleUser = (memberId: number) => {
    const toggledClinic = ClinicsOfClient.toggleUserCanSee(memberId);
    if (!toggledClinic) return;

    ClinicsOfClient.saveToLocalStorage(toggledClinic);
    ClinicsOfClient.set(toggledClinic);
    // clinicListsVar([...toggledClinic]);
  };

  return { toggleUser };
};
