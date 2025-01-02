"use server";

import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";

import {
  ItemInput,
  items,
  ItemStatus,
  ItemType,
  Project,
} from "@/backend/persistence/schema";
import { eq, sql } from "drizzle-orm";

export const bootstrapItem = async (projectId: string) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(eq(items.projectId, projectId))
      .execute();

    const result = await db
      .insert(items)
      .values({
        title: "(untitled)",
        body: "(item explanation)",
        projectId,
        status: ItemStatus.Todo,
        type: ItemType.Bug,
        creatorUserId: session.userId,
        serialNumber: Number(count[0].count) + 1,
      })
      .returning({ id: items.id });

    return {
      success: true,
      error: null,
      itemId: result[0].id,
    };

    // await db.insert(items).values({
  } catch (error) {
    return {
      success: false,
      error: "Failed to create item",
      itemId: null,
    };
  }
};

export const updateItem = async (itemId: string, payload: ItemInput) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    const result = await db
      .update(items)
      .set({ ...payload })
      .where(eq(items.id, itemId))
      .returning({ id: items.id });

    return {
      success: true,
      error: null,
      itemId: result[0].id,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update item",
      itemId: null,
    };
  }
};
