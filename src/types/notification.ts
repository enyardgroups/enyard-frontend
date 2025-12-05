export interface Notification {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewNotification = Omit<
  Notification,
  "id" | "createdAt" | "updatedAt"
>;

export interface NotificationResponse {
  success: boolean;
  data: Notification;
  message: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  message?: string; // getAll might not have a message
}
