import jwt from "jsonwebtoken";
import GoogleProvider from "next-auth/providers/google";
// import { connect } from "@/dbConfig/connection";
import bcryptjs from "bcryptjs";
import axios from "axios";
import prisma from "@/server/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOption = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // authorize: async (credentials) => {
      //   const { email, password } = credentials;
      //   try {
      //     // Example: Send a POST request to your authentication API
      //     const teamMember = await prisma.teamMember.findUnique({
      //       where: { email },
      //     });
      //     delete teamMember.password;
      //     if (teamMember.id) {
      //       return { ...teamMember };
      //     } else {
      //       // Authentication failed
      //       return Promise.resolve(null);
      //     }
      //   } catch (error) {
      //     console.error("Authentication error:", error);
      //     return Promise.resolve(null);
      //   }
      // },
      async authorize(credentials) {
        const { email, password } = credentials;
        //check if user exists
        const user = await prisma.teamMember.findUnique({
          where: { email },
        });
        console.log(user);
        if (!user) {
          throw new Error(`This user does not exist.`);
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Wrong credentials. Try again.");
        }
        return user;
      },
    }),
  ],
  // secret: process.env.JWT_SECRET,

  callbacks: {
    async jwt({ token, user, session }) {
      // console.log("jwt", token, session, user);
      console.log("user => ", user);
      if (user) {
        token.id = user?.id;
        token.userRole = user?.userRole;
        token.firstName = user?.firstName;
        token.lastName = user?.lastName;
        token.email = user?.email;
        token.merchantID = user?.merchantID;
        token.shopID = user?.shopID;
      }

      return token;
    },
    async session({ session, token }) {
      const encodedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });
      session.accessToken = encodedToken;

      const newsessionObj = { ...session.user, ...token };
      session.user = newsessionObj;
      return session;
    },
    async signIn({ user, profile }) {
      // console.log("signIn", profile, user);

      // connect();
      // if (profile?.email) {
      //   const userRes = await User.findOne({ email: profile?.email });
      //   if (!userRes) {
      //     const newUser = await User.create({
      //       email: profile?.email,
      //       username: profile?.given_name,
      //       profile: {
      //         name: profile?.name,
      //         avatar: profile?.picture,
      //       },
      //     });
      //     user.id = newUser?._id;
      //     user.role = newUser?.role;
      //     user.avatar = newUser?.profile?.avatar;
      //   } else {
      //     user.id = userRes?._id;
      //     user.role = userRes?.role;
      //     user.avatar = userRes?.profile?.avatar;
      //     user.mobile = userRes?.mobile;
      //     // console.log("====================================");
      //     // console.log(userRes);
      //     // console.log("====================================");
      //   }
      // }

      //check if user exists
      return true;
    },
  },
  jwt: {
    // secret: process.env.NEXTAUTH_SECRET,

    encode: async ({ secret, token }) => {
      const jwtClaims = {
        id: token?.id,
        role: token?.userRole,
        firstName: token?.firstName,
        lastName: token?.lastName,
        merchantID: token?.merchantID,
        email: token?.email,
        shopID: token?.shopID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: "HS256" });

      return encodedToken;
    },
    decode: ({ secret, token }) => {
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};
