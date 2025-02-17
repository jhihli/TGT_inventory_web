import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt"

// Extend the built-in `User` type
declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string;
    }

    interface Session {
        user: {
            id: string,
            username: string,
            role: string; // Ensure session.user includes role
        } & DefaultSession
    }
}

// Extend the built-in `JWT` type
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT{
        role: string; // Ensure JWT includes role
    }
}
