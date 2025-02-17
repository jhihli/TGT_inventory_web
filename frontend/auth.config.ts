import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(user.role);
        token.role = user.role; // Store role in token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log(token.role);
        session.user.role = token.role; // Pass role to session
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      console.log('authorized callback triggered');
      const isLoggedIn = !!auth?.user;

      // keep stay in dashboard if user is already logged in
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;