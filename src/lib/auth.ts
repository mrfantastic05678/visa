import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { account, session, user, verification } from "./db/schema";
import { sendPasswordResetEmail } from "./resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name ?? "Team Member",
        resetUrl: url,
      });
    },
  },
  secret: process.env.BETTER_AUTH_SECRET ?? "build-time-placeholder-replace-in-production",
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
