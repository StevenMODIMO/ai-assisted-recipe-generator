import CredentialsProvider from "next-auth/providers/credentials";
import TwitterProvider from "next-auth/providers/twitter";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcrypt";
import { dbConnect } from "./db";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import { isEmail } from "validator";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const { email, password } = credentials;
        await dbConnect();
        if (!email || !password) {
          throw new Error("All fields are required.");
        }

        if (!isEmail(email)) {
          throw new Error("Invalid email");
        }
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Incorrect email");
        }
        const match = await compare(password, user.password);

        if (!match) {
          throw Error("Incorrect password");
        }
        return {
          id: user._id.toString(),
          email: user.email,
          avatar: user.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "email profile openid" } },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          avatar: profile.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.avatar_url = user.avatar_url;
      }
      if (trigger === "update" && session?.user) {
        token.avatar_url = session.user.avatar_url;
        token.id = session.user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.avatar_url = token.avatar_url;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (user) {
        console.log("USER FROM SIGNIN PARAM: ", user);
        console.log("USER FROM ACCOUNT PARAM: ", account);
        console.log("USER FROM PROFILE PARAM: ", profile);
      }
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const exists_user = await User.findOne({ email: profile?.email });
          if (exists_user) {
            if (exists_user.provider !== account.provider) {
              return "/login?error=User alredy exists with different provider";
            }
            return true;
          }
          await User.create({
            email: user?.email,
            avatar_url: user?.avatar_url,
            provider: account?.provider,
          });
          return true;
        } catch (error) {
          console.log("SIGNIN-ERROR", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else {
        return baseUrl;
      }
    },
  },
};
