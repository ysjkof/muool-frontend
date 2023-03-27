export const ROOT = '/';

// timetable
export const TIMETABLE = '/tt';

// search
export const PATIENT_SEARCH = '/search';

// dashboard
export const DASHBOARD = {
  member: {
    root: '/dashboard/clinic/members',
    detail: ':memberId',
    invite: 'invite',
  },
  prescriptions: {
    root: '/dashboard/clinic/prescriptions',
    create: 'create',
    edit: ':prescriptionId/edit',
  },
  statistics: {
    root: 'dashboard/clinic/statistics',
  },
};

// setting
export const SETTING = {
  root: 'setting',
  myInfo: 'my-info',
  myClinics: 'my-clinics',
  createClinic: 'clinic/create',
};

// auth
export const LOGIN = '/login';
export const SIGN_UP = '/sign-up';
export const AUTHENTICATE_EMAIL = '/authenticate/email'; // `authenticate/email/code=<인증코드>`
