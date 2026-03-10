export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AUTH_ROUTES = {
  LOGIN: `${BACKEND_URL}/api/auth/login`,
  CURRENT_USER: `${BACKEND_URL}/api/auth/me`,
};

export const DASHBOARD_ROUTES = {
  GET: `${BACKEND_URL}/api/dashboard`,
};
