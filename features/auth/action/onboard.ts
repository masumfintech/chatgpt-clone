import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * Syncs the signed-in Clerk user into the local Prisma `User` table (upsert).
 *
 * @returns The created or updated Prisma user record.
 * @throws {Error} When no Clerk session is present.
 */
export async function onBoard() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
    update: {
      email,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
  });
}