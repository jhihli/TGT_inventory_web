
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
//import { sql } from '@vercel/postgres';
import { z } from 'zod';
//import type { User } from '@/app/lib/definitions';
import type { User } from "@/interface/IDatatable"
import bcrypt from 'bcrypt';


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
            console.log("222222222");
            throw new Error(`Error: ${response.status} - ${response.statusText} -  ${response.json}`);
        }

        const data: User[] = await response.json();

        if (data.length === 0) {
            console.log("User not found");
            return null;
        }

        return data[0]; // Ensure that the backend response structure matches
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const parsedCredentials = z
                        .object({ username: z.string(), password: z.string() })
                        .safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log("Invalid input format");
                        return null;
                    }

                    const { username, password } = parsedCredentials.data;

                    // Fetch user from Django backend
                    const user = await getUser(username);


                    if (!user || !user.password) {
                        console.log("User not found or missing password");
                        return null;
                    }


                    // const passwordsMatch = await bcrypt.compare(password, user.password);
                    // if (!passwordsMatch) {
                    //     console.log("Incorrect password");
                    //     return null;
                    // }

                    //  Convert `bigint` to `string`
                    console.log("1111222221111111111111111111");
                    console.log(user);

                    return {
                        ...user,
                        id: user.id.toString(), // Fixes NextAuth type error
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


});