import { API } from "@/lib/ApiUrl";
import { jwtVerify, JWTVerifyResult } from "jose";
import { JWTClaimValidationFailed, JWTExpired } from "jose/errors";
interface VerifiedPayload {
    id: string;
    role: 'USER' | 'ADMIN';
    sessionId: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  
  export async function verifyTokenWithoutDB(token: string): Promise<VerifiedPayload> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable not configured');
    }
  
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    try {
      const { payload }: JWTVerifyResult = await jwtVerify(token, secret, {
        issuer: API.INTERNAL,
        audience: API.INTERNAL,
        clockTolerance: 15, // 15 seconds grace period
        requiredClaims: ['sub', 'role', 'email', 'sessionId']
      });
      console.log(payload)
      // Validate payload structure
      const validationErrors = [];
      if (typeof payload.sub !== 'number') validationErrors.push('Missing/invalid user ID (sub)');
      if (!['USER', 'ADMIN'].includes(payload.role as string)) validationErrors.push('Invalid role');
      if (typeof payload.email !== 'string') validationErrors.push('Missing email');
      if (typeof payload.sessionId !== 'number') validationErrors.push('Missing session ID');
  
      if (validationErrors.length > 0) {
        throw new Error(`Invalid token payload: ${validationErrors.join(', ')}`);
      }
  
      return {
        id: payload.sub as string,
        role: payload.role as 'USER' | 'ADMIN',
        sessionId: payload.sessionId as string,
        email: payload.email as string,
        firstName: payload.firstName as string,
        lastName: payload.lastName as string
      };
  
    } catch (error) {
      console.error('Token verification failed:');
      
      // Handle specific JWT errors
      if (error instanceof JWTExpired) {
        console.error('Token expired at:', error.expiredAt);
        throw new Error('Session expired - please log in again');
      }
  
      if (error instanceof JWTClaimValidationFailed) {
        console.error('Claim validation failed:', error.claim, error.reason);
        throw new Error(`Security validation failed: ${error.message}`);
      }
  
      // Handle legacy token format
      if (error.message.includes('sessionId')) {
        console.warn('Legacy token detected - initiating migration');
        throw new Error('Please re-authenticate to upgrade your session');
      }
  
      // Generic error fallback
      console.error('Authentication error:', error);
      throw new Error('Invalid session - please log in again');
    }
  }