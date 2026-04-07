import type { PrismaClient, User } from "@prisma/client";

import { hashPassword, verifyPassword } from "~/lib/auth/password.server";

type UserStore = Pick<PrismaClient, "user">;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createUserAccount(
  db: UserStore,
  input: { displayName?: string; email: string; password: string }
): Promise<User> {
  const passwordHash = await hashPassword(input.password);

  return db.user.create({
    data: {
      displayName: input.displayName?.trim() || null,
      email: normalizeEmail(input.email),
      passwordHash
    }
  });
}

export async function signInUserWithPassword(
  db: UserStore,
  input: { email: string; password: string }
): Promise<User | null> {
  const maybeUser = await db.user.findUnique({
    where: {
      email: normalizeEmail(input.email)
    }
  });

  if (!maybeUser?.passwordHash) {
    return null;
  }

  if (!(await verifyPassword(input.password, maybeUser.passwordHash))) {
    return null;
  }

  return maybeUser;
}
