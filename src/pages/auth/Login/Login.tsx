import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LoginInput,
  LoginMutation,
  useLoginMutation,
} from '../../../graphql/generated/graphql';
import Input from '../../../components/molecules/Input';
import FormError from '../../../components/atoms/FormError';
import Button from '../../../components/molecules/Button';
import { REG_EXP } from '../../../constants/regex';
import { login } from '../authServices';
import { toastVar } from '../../../store';
import { MUOOL } from '../../../constants/constants';

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LoginInput>({ mode: 'onChange' });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token, error },
    } = data;

    if (error) {
      return toastVar({ messages: [error] });
    }

    if (ok && token) {
      return login(token, () => navigate('/'));
    }
  };

  const [loginMutation, { loading }] = useLoginMutation({
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      if (!email || !password) return;

      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>로그인 | {MUOOL}</title>
      </Helmet>

      <h4 className="mb-6 text-center text-base font-semibold">
        물리치료사를 위한 하나의 앱
      </h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        <Input
          id="email"
          label={'Email'}
          type="email"
          placeholder="Email"
          maxLength={REG_EXP.email.maxLength}
          register={register('email', {
            required: 'Email을 입력하세요',
            pattern: REG_EXP.email.pattern,
          })}
          children={
            <>
              {errors.email?.message ? (
                <FormError errorMessage={errors.email.message} />
              ) : (
                errors.email?.type === 'pattern' && (
                  <FormError errorMessage={REG_EXP.email.condition} />
                )
              )}
            </>
          }
        />
        <Input
          id="password"
          label="비밀번호"
          type="password"
          placeholder="Password"
          register={register('password', {
            required: '비밀번호를 입력하세요',
            pattern:
              process.env.NODE_ENV === 'production'
                ? REG_EXP.password.pattern
                : undefined,
          })}
        >
          {errors.password?.message ? (
            <FormError errorMessage={errors.password.message} />
          ) : (
            errors.password?.type === 'pattern' && (
              <FormError errorMessage={REG_EXP.password.condition} />
            )
          )}
        </Input>
        <Button type="submit" canClick={isValid} loading={loading}>
          로그인
        </Button>
      </form>
    </>
  );
}