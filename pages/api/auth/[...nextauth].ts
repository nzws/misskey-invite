import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    })
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.id = user?.id;
      }
      return token;
    },
    session({ session, token }) {
      const user = {
        id: token.id,
        ...session.user
      };

      session.user = user;

      return session;
    }
  }
};

export default NextAuth(authOptions);
