import ConnectionDB from "@/lib/ConnectionDB";
import administratorService from "@/modules/administrator/administrator.service";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Username',
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await ConnectionDB();

        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const { success, data, errors, message } = await administratorService.LoginAdmin({
          password,
          username
        });

        if (success === true) {
          const user: any = {
            username: data?.username,
            id: data?.sid,
            role: data?.role,
            name: data?.name,
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, account, user, trigger, session }: any) => {
      if (trigger === "update" && session?.name) {
        token.name = session?.name;
      }

      if (trigger === "update" && session?.username) {
        token.username = session?.username;
      }

      if (trigger === "update" && session?.role) {
        token.role = session?.role;
      }

      if (account?.provider === "credentials") {
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, user, token, trigger }: any) => {
      if ("name" in token) {
        session.user.name = token.name;
      }
      if ("username" in token) {
        session.user.username = token.username;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }
      return session;
    },
  },

});

export { handler as GET, handler as POST };

