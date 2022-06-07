import {
  Clinic,
  Member,
  Notice,
  useMeQuery,
  User,
} from "../graphql/generated/graphql";

// apollo는 캐시를 먼저 탐색하고 없다면 백엔드에 요청한다. useMe가 여러곳에서 호출되더라도 캐시에 있다면 자동으로 재사용하고 백엔드를 거치지 않는다.
export const useMe = () => {
  return useMeQuery();
};

interface ModifiedClinicMemberWithClinic
  extends Pick<Member, "id" | "staying" | "manager" | "accepted"> {
  clinic: Pick<Clinic, "id" | "name" | "isActivated">;
}
interface ModifiedNotice extends Pick<Notice, "message" | "read"> {}
export interface ModifiedLoggedInUser
  extends Pick<User, "id" | "name" | "email" | "role" | "verified"> {
  members?: ModifiedClinicMemberWithClinic[] | null;
  notice?: ModifiedNotice[] | null;
}
