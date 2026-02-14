import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      avatar_url?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    avatar_url?: string;
    profile_image_url?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    avatar_url?: string;
  }
}
