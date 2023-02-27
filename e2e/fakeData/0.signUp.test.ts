import { test, expect } from '@playwright/test';

const NAMES = ['이성진', '정문석', '심재훈', '윤도현', '양석진', '이혜민'];
const EMAIL = [
  'test@t.co',
  'test1@t.co',
  'test2@t.co',
  'test3@t.co',
  'test4@t.co',
  'test5@t.co',
];
const PASSWORD = '123';

test.afterAll(async ({ page }) => {
  await page.close();
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test('6개의 계정 만들기', async ({ page }) => {
  const linkToLogin = page.getByRole('link', { name: '로그인/회원가입' });
  const linkOfSignUp = page.getByRole('link', {
    name: '계정이 없습니까?회원가입',
  });

  const signupEmail = page.getByPlaceholder(
    '로그인에 사용할 Email을 입력하세요'
  );
  const signupName = page.getByPlaceholder('이름을 입력하세요');
  const passwordInput = page.getByPlaceholder('비밀번호를 입력하세요');
  const alertCloseBtn = page.locator('#alert').getByText('창 닫기');
  const alertContainer = page.getByText(
    /입력한 주소로 인증 이메일을 전송했습니다./
  );

  for (const email of EMAIL) {
    await linkToLogin.click();
    await linkOfSignUp.click();

    await signupEmail.fill(email);
    await signupName.fill(NAMES[EMAIL.indexOf(email)]);
    await passwordInput.fill(PASSWORD);
    await passwordInput.press('Enter');

    await expect(alertContainer).toBeVisible();
    await alertCloseBtn.click();
  }
});
