"use server";
import { auth } from "@/lib/db";
import { prisma } from "@clerk/nextjs/server";

export async function requireUser() {
    const {userId} = await auth.protect();
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });
    if (!user) {
        throw new Error("User not found, Complete onboarding first");
    }
    return user;
}
