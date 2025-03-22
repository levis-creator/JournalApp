export type UserPayload = {
    id: string;
    role: 'USER' | 'ADMIN';
    email: string;
    firstName?: string;
    sessionId?:string|number;
    lastName?: string;
    iss?: string;  // JWT issuer
    aud?: string;  // JWT audience
  };