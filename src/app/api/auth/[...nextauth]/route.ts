import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          // If no user exists, maybe it's the first time and we should seed an admin?
          // For simplicity in this demo CMS, we allow the first login to create an admin if no users exist
          const userCount = await prisma.user.count();
          if (userCount === 0 && credentials.email === "admin@vetclinic.com" && credentials.password === "admin") {
             const hashedPassword = await bcrypt.hash("admin", 10);
             const newUser = await prisma.user.create({
               data: {
                 name: "Admin",
                 email: "admin@vetclinic.com",
                 password: hashedPassword,
                 role: "Administrator"
               }
             });
             return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
          }
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
