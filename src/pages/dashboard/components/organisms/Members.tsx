import { checkManager, getMemberState } from '../../../../utils/utils';
import useStore from '../../../../hooks/useStore';
import { Button } from '../../../../components/molecules/Button';
import useCancelInvitation from '../../hooks/useCancelInvitation';
import { loggedInUserVar } from '../../../../store';
import Card from '../molecules/Card';

export const Members = () => {
  const loggedInUser = loggedInUserVar();
  const { selectedInfo } = useStore();
  const { invokeCancelInvitation, loading: loadingCancel } =
    useCancelInvitation();

  const isManager = checkManager(
    selectedInfo.clinic?.members!,
    loggedInUser!.id
  );

  return (
    <section className="h-full">
      <Card.Container>
        {selectedInfo.clinic?.members?.map((member) => {
          const state = getMemberState(
            member.staying,
            member.accepted,
            member.manager
          );
          return (
            <Card
              key={member.user.id}
              name={member.user.name}
              state={state}
              button={
                state === '승인대기' &&
                isManager && (
                  <Button
                    type="button"
                    isSmall
                    canClick={!loadingCancel}
                    loading={loadingCancel}
                    onClick={() => invokeCancelInvitation(member.id, true)}
                  >
                    초대취소
                  </Button>
                )
              }
            />
          );
        })}
      </Card.Container>
    </section>
  );
};
