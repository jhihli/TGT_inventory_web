import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt"

// Extend the built-in `User` type
declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string;
    }

    interface Session {
        user: {
            role: string; // Ensure session.user includes role
        } & DefaultSession["user"];
    }
}

// Extend the built-in `JWT` type
declare module "next-auth/jwt" {
    interface JWT {
        role: string; // Ensure JWT includes role
    }
}
