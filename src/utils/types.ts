export interface User {
  id?: number|string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?:string;
  email: string;
  password?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sessionId?:string|number;
}