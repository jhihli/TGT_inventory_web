import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/interface/IDatatable";
//import type { NextAuthOptions } from 'next-auth'


async function getUser(username: string) {
    const API_URL = process.env.NEXT_PUBLIC_Django_API_URL;

    if (!API_URL) {
        console.error("API URL is not set!");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/account/users/?username=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data: User[] = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
}

console.log('Load route.ts.......................................');
//export const authOptions: NextAuthOptions = {
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    console.log("🔍 Received credentials:", credentials);
                    const parsedCredentials = z
                        .object({ username: z.string(), password: z.string() })
                        .safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log("Invalid input format");
                        return null;
                    }

                    const { username, password } = parsedCredentials.data;

                    const user = await getUser(username);
                    if (!user || !user.password) {
                        console.log("User not found or missing password");
                        return null;
                    }

                    return {
                        ...user,
                        id: user.id.toString(), // Ensure ID is string type
                        username: user.username,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Error in authorization:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Store role in token
            }
            return token;
        },
        async session({ session, token }) {
            console.log("🔍 Session Callback Triggered");
            console.log("🔹 Incoming Token:", token);
            if (session.user) {
                session.user.role = token.role; // Pass role to session
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            console.log("authorized callback triggered");
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

            if (isOnDashboard) {
                return isLoggedIn ? true : false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};