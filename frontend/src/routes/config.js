export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  INTAKE: '/intake',
  DASHBOARD: '/dashboard',
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_PROFILE: '/dashboard/profile',
  APPOINTMENTS: '/appointments',
  MEDICAL_RECORDS: '/medical-records',
  LAB_RESULTS: '/lab-results',
  PRESCRIPTIONS: '/prescriptions',
  BILLING: '/billing',
  PROFILE_SETTINGS: '/profile-settings',
  BOOK_APPOINTMENT: '/book-appointment',
  CALENDAR: '/calendar',
};

export const SECTIONS = ['home', 'about', 'services', 'contact'];

export const NAV_KEY_TO_ROUTE = {
  login: ROUTES.LOGIN,
  intake: ROUTES.INTAKE,
  'intake-form': ROUTES.INTAKE,
  appointments: ROUTES.APPOINTMENTS,
  'medical-records': ROUTES.MEDICAL_RECORDS,
  'lab-results': ROUTES.LAB_RESULTS,
  prescriptions: ROUTES.PRESCRIPTIONS,
  billing: ROUTES.BILLING,
  'profile-settings': ROUTES.PROFILE_SETTINGS,
  calendar: ROUTES.CALENDAR,
  'book-appointment': ROUTES.BOOK_APPOINTMENT,
  dashboard: ROUTES.DASHBOARD,
};

export const PATH_TO_NAV_KEY = [
  { prefix: ROUTES.DASHBOARD, key: 'dashboard' },
  { prefix: ROUTES.APPOINTMENTS, key: 'appointments' },
  { prefix: ROUTES.MEDICAL_RECORDS, key: 'medical-records' },
  { prefix: ROUTES.LAB_RESULTS, key: 'lab-results' },
  { prefix: ROUTES.PRESCRIPTIONS, key: 'prescriptions' },
  { prefix: ROUTES.BILLING, key: 'billing' },
  { prefix: ROUTES.PROFILE_SETTINGS, key: 'profile-settings' },
  { prefix: ROUTES.BOOK_APPOINTMENT, key: 'book-appointment' },
  { prefix: ROUTES.INTAKE, key: 'intake' },
  { prefix: ROUTES.LOGIN, key: 'login' },
  { prefix: ROUTES.FORGOT_PASSWORD, key: 'forgot-password' },
  { prefix: ROUTES.CALENDAR, key: 'calendar' },
];

export const PROTECTED_PATHS = [
  ROUTES.DASHBOARD,
  ROUTES.DASHBOARD_OVERVIEW,
  ROUTES.DASHBOARD_PROFILE,
  ROUTES.APPOINTMENTS,
  ROUTES.MEDICAL_RECORDS,
  ROUTES.LAB_RESULTS,
  ROUTES.PRESCRIPTIONS,
  ROUTES.BILLING,
  ROUTES.PROFILE_SETTINGS,
  ROUTES.BOOK_APPOINTMENT,
  ROUTES.CALENDAR,
];
