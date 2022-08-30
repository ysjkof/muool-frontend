import { useReactiveVar } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { client } from '../../../apollo';
import { FormError } from '../../../components/atoms/FormError';
import { Button } from '../../../components/molecules/Button';
import { Input } from '../../../components/molecules/Input';
import { REG_EXP } from '../../../constants/regex';
import {
  CreateClinicInput,
  FindMyClinicsDocument,
  MeDocument,
  useCreateClinicMutation,
} from '../../../graphql/generated/graphql';
import { selectedInfoVar, toastVar } from '../../../store';
import { DashboardSectionLayout } from '../components/DashboardSectionLayout';

export const CreateClinic = () => {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const {
    register,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<Pick<CreateClinicInput, 'name'>>({ mode: 'onChange' });

  const [createClinicMutation, { loading, data }] = useCreateClinicMutation();

  const onSubmitCreateClinic = () => {
    if (!loading) {
      let { name } = getValues();
      name = name.trim();
      createClinicMutation({
        variables: { input: { name } },
        onCompleted(data) {
          if (data.createClinic.ok) {
            if (!selectedInfo.clinic) throw new Error('선택된 병원이 없습니다');
            toastVar({ message: `병원 "${name}"을 만들었습니다` });
            client.cache.updateQuery(
              {
                query: FindMyClinicsDocument,
                variables: { input: { includeInactivate: true } },
                broadcast: false,
              },
              (cacheData) => {
                return {
                  ...cacheData,
                  findMyClinics: {
                    ...cacheData.findMyClinics,
                    clinics: [
                      ...cacheData.findMyClinics.clinics,
                      data.createClinic.clinic,
                    ],
                  },
                };
              }
            );

            client.cache.updateQuery(
              {
                query: MeDocument,
                broadcast: false,
              },
              (cacheData) => {
                return {
                  me: {
                    ...cacheData.me,
                    members: [
                      ...cacheData.me.members,
                      data.createClinic.clinic?.members,
                    ],
                  },
                };
              }
            );
          }
        },
      });
    }
  };
  const invokeClearErrors = () => {
    if (errors.name && !errors.name.message && !errors.name.type) return;
    clearErrors('name');
  };
  return (
    <DashboardSectionLayout
      title="병원 만들기"
      width="md"
      moreYGap
      heightFull
      children={
        <form
          onSubmit={handleSubmit(onSubmitCreateClinic)}
          className="space-y-6"
        >
          <Input
            id="name"
            label={'이름*'}
            placeholder={'병원 이름'}
            type="text"
            onChange={invokeClearErrors}
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.clinicName.pattern,
            })}
          >
            {errors.name?.message ? (
              <FormError errorMessage={errors.name.message} />
            ) : errors.name?.type === 'pattern' ? (
              <FormError errorMessage={REG_EXP.clinicName.condition} />
            ) : (
              data?.createClinic.error && (
                <FormError errorMessage={data.createClinic.error} />
              )
            )}
          </Input>
          <Button
            isWidthFull
            type="submit"
            textContents={'만들기'}
            canClick={isValid}
            loading={loading}
          />
        </form>
      }
    />
  );
};
