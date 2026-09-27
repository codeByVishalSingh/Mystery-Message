import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/connectDB";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        await connectDB();

        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const existUser = await UserModel.findOne({
            email: credentials.email,
          });

          if (!existUser) {
            throw new Error("No user found with this email");
          }

          if (!existUser.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            existUser.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: existUser._id.toString(),
            email: existUser.email,
            username: existUser.username,
            user:existUser
          };
        } catch (error) {
          console.error("Authorize error:", error);

          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token,user}) {
        if(user){
           token._id = user._id;
           token.isVerified = user.isVerified;
           token.isAccept = user.isAccept;
           token.username=user.username;
        }
        return token
    },
    
      async session({ session, token }) {
          if (token) {
              session.user._id =  token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAccept =  token.isAccept;
              session.user.username = token.username;
          }
          return session
      }
  },
  pages:{
    signIn: '/sign-in'
  },
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXTAUTH_SECRET,
};