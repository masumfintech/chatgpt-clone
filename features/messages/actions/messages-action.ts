"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";
import { MessageRole } from "@/lib/generated/prisma/client";

export type MessageListItem = {
    id: string;
    conversationId: string;
    role: MessageRole;
    status: "PENDING" | "COMPLETE" | "ERROR";
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

async function assertOwnsMessage(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId
        },
    });
    if(!conversation){
        throw new Error("Conversation not found");
    }
    return conversation;
}


export async function listMessages( conversationId: string ) : Promise<MessageListItem[]> {
    const user = await requireUser();
    await assertOwnsMessage(conversationId, user.id);
    return prisma.message.findMany({
        where: { conversationId },
        orderBy: {createdAt: "asc"},
        select: {
            id: true,
            conversationId: true,
            role: true,
            status: true,
            content: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

/**
 * Create a user message in a conversation.
 * No AI reply yet — this only persists the user's text.
 * Optionally renames "New Chat" using the first message.
 */
export async function createMessage(conversationId: string, content: string) {
}

/** Update message text (e.g. edit). */
export async function updateMessage(messageId: string, content: string) {
}

/** Delete a single message. */
export async function deleteMessage(messageId: string) {
}
