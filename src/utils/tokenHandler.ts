'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Set both accessToken and refreshToken
export const setTokens = async (accessToken: string, id?:string|number) => {
  const cookiesStore = await cookies();

  // Store Access Token
  cookiesStore.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 3600, // 1 hour
  });

  
  cookiesStore.set('id', id as unknown as string , {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 3600, // 7 Days
  });
};

export const getToken = async () => {
  const cookiesStore = await cookies();
  return cookiesStore.get('token')?.value;
};
export const getCookieId = async () => {
  const cookiesStore = await cookies();
  return cookiesStore.get('id')?.value;
};



export const removeTokens = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete('token');
  cookiesStore.delete('id');
};
export async function deleteToken(response: NextResponse) {
  response.cookies.delete('token');
  return response;
}