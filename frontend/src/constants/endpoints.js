export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AUTH_ROUTES = {
  LOGIN: `${BACKEND_URL}/api/auth/login`,
  CURRENT_USER: `${BACKEND_URL}/api/auth/me`,
};

export const DASHBOARD_ROUTES = {
  GET: `${BACKEND_URL}/api/dashboard`,
};

export const PURCHASE_ROUTES = {
  GET: `${BACKEND_URL}/api/purchase`,
  CREATE: `${BACKEND_URL}/api/purchase`,
  DELETE: (id) => `${BACKEND_URL}/api/purchase/${id}`,
};

export const ASSET_ROUTES = {
  GET_ALL: `${BACKEND_URL}/api/asset`,
  GET_BY_ID: (id) => `${BACKEND_URL}/api/asset/${id}`,
};
