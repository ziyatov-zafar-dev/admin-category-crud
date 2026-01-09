
export const API_BASE = 'https://4bdf137143e3.ngrok-free.app/api';

export const ENDPOINTS = {
  USER: `${API_BASE}/user/find-by-chat-id`,
  CATEGORY_LIST: `${API_BASE}/category/list`,
  CATEGORY_ADD: `${API_BASE}/category/add-category`,
  CATEGORY_EDIT: (id: string) => `${API_BASE}/category/edit-category/${id}`,
  CATEGORY_DELETE: (id: string) => `${API_BASE}/category/delete-category/${id}`,
};

export const DEFAULT_CHAT_ID = '7882316826';
