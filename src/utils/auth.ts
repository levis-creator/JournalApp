import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './types';
import prisma from '@/lib/prisma';
import { getToken } from './tokenHandler';
import { API } from '@/lib/ApiUrl';
import { SignJWT } from 'jose';
import { verifyTokenWithoutDB } from './auth-edge';


const SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Hashes a password using bcrypt.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generates a JWT token for a user.
 * @param user - The user object containing `id`, `role`, and `username`.
 * @returns A JWT token.
 */
export const generateToken = async (user: User): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  if (!user.id || !user.sessionId) {
    throw new Error('Invalid user data for token generation');
  }

  return new SignJWT({
    sub: user.id as string, // Store UUID as string
    role: user.role,
    sessionId: user.sessionId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setIssuer(API.INTERNAL as string)
  .setAudience(API.INTERNAL as string)
  .setExpirationTime('1h')
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};
/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded token payload if verification is successful.
 * @throws An error if the token is invalid or expired.
 */
export const verifyToken = (token: string): User => {
  return jwt.verify(token, SECRET) as User;
};
export async function verifyAuth(token: string) {
  try {
    const decoded:User = verifyToken(token);
    const session = await prisma.session.findUnique({
      where: {
        id: decoded.sessionId as number,
        valid: true,
        expiresAt: { gt: new Date() },
        userId: decoded.id as number
      }
    });
    
    return session ? decoded : null;
  } catch (error) {
    console.error(error)
    return null;
  }
}

export async function getAuthUser() {
  const token = await getToken();
  if (!token) throw new Error('Unauthorized');

  const decoded = await verifyTokenWithoutDB(token);
  if (!decoded?.sessionId || !decoded.id) throw new Error('Invalid token');

  const user = await prisma.user.findUnique({
    where: { 
      id: parseInt(decoded.id),
      sessions: {
        some: { 
          id: parseInt(decoded.sessionId),
          valid: true,
          expiresAt: { gt: new Date() }
        }
      }
    }
  });

  if (!user) throw new Error('Invalid session');
  return user;
}