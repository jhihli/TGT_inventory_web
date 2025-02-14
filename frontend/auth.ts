"üse server"
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
//import { sql } from '@vercel/postgres';
import { z } from 'zod';
//import type { User } from '@/app/lib/definitions';
import { User } from "@/interface/IDatatable"
import bcrypt from 'bcrypt';
 
export async function getUser(email: string): Promise<User | null> {
    const API_URL = process.env.NEXT_PUBLIC_Django_API_URL;  

    if (!API_URL) {
        console.error("API URL is not set!");
        return null;
    }
        
    try {
        const response = await fetch(`${API_URL}/users/get-user?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (!response.ok) {
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
      async authorize(credentials, request): Promise<User | null> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.log("Invalid input format");
            return null;
        }
 
        const { email, password } = parsedCredentials.data;
                
        // Fetch user from Django backend
        const user = await getUser(email);
        if (!user || !user.password) {
            console.log("User not found or missing password");
            return null;
        }              
        
        // Validate password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            console.log("Incorrect password");
            return null;
        }
 
        
        return user;
        }
    }),
  ],
});