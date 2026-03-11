export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AUTH_ROUTES = {
  LOGIN: `${BACKEND_URL}/api/auth/login`,
  LOGOUT: `${BACKEND_URL}/api/auth/logout`,
  CURRENT_USER: `${BACKEND_URL}/api/auth/me`,
};

export const DASHBOARD_ROUTES = {
  GET: `${BACKEND_URL}/api/dashboard`,
};

export const ASSET_ROUTES = {
  GET_ALL: `${BACKEND_URL}/api/asset`,
  GET_BY_ID: (id) => `${BACKEND_URL}/api/asset/${id}`,
};

export const PURCHASE_ROUTES = {
  GET: `${BACKEND_URL}/api/purchase`,
  CREATE: `${BACKEND_URL}/api/purchase`,
  DELETE: (id) => `${BACKEND_URL}/api/purchase/${id}`,
};

export const TRANSFER_ROUTES = {
  GET: `${BACKEND_URL}/api/transfer`,
  CREATE: `${BACKEND_URL}/api/transfer`,
  GET_BY_ID: (id) => `${BACKEND_URL}/api/transfer/${id}`,
  UPDATE_STATUS: (id) => `${BACKEND_URL}/api/transfer/${id}/status`,
};

export const ASSIGNMENT_ROUTES = {
  GET: `${BACKEND_URL}/api/assignment`,
  CREATE: `${BACKEND_URL}/api/assignment`,
  EXPEND: (id) => `${BACKEND_URL}/api/assignment/${id}/expend`,
  RETURN: (id) => `${BACKEND_URL}/api/assignment/${id}/return`,
};
