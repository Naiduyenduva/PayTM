import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/prismadb";
import bcrypt from 'bcrypt';
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { DefaultSession, DefaultUser } from "next-auth";
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}

interface UserType {
  id: string;
  username: string;
  password?: string;
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            
            credentials: {
              username: { label: "username", type: "text", placeholder: "username" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
              
              if (!credentials?.username || !credentials?.password) {
                throw new Error('Username and password are required');
              }

              const isUserExists = await prisma.user.findFirst({
                where: {
                  username: credentials?.username.toLowerCase()
                },
                select: {
                  id: true,
                  password: true,
                  username: true
                },
              });

              if (!isUserExists) {
                throw new Error('Invalid credentials')
              } 

              const isPasswordCorrect = await bcrypt.compare(credentials?.password,isUserExists?.password)

              if (!isPasswordCorrect) {
                throw new Error('Incorrect password')
              } 
              return {
                id: isUserExists.id,
                username: credentials.username,
              };
            }
          })
        ],
    secret:process.env.NEXTAUTH_SECRET,
    // pages: {
    //   signIn: "/client/login"
    // },
    callbacks: {
      async jwt({ token, user }: {token: JWT; user?: User | AdapterUser | undefined}): Promise<JWT>{
        if (user) {
          token.id = user.id;
          token.username = (user as UserType).username; 
        }
        return token;
      },
  
      async session({ session, token }:{session: Session; token: JWT}): Promise<Session> {
        if (session.user) {
          session.user.id = token.id;
          session.user.username = token.username;
        }
        return session;
      },
    },
  }