
export enum CategoryStatus {
  OPEN = 'OPEN',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Category {
  id: string;
  nameUz: string;
  nameUzCyrillic?: string;
  nameRu?: string;
  nameEn?: string;
  orderIndex: number;
  status: CategoryStatus;
  chatId: string;
  parentId?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  chatId: string;
  status: 'CONFIRMED' | 'PENDING' | 'BLOCKED';
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
