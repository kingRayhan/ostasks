"use server";

import { db } from "@/backend/persistence/db";
import { getAuthSession } from "../api/api-utils";
import {
  items,
  ItemStatus,
  ItemType,
  Project,
} from "@/backend/persistence/schema";

export const bootstrapItem = async (projectId: string) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    const result = await db
      .insert(items)
      .values({
        title: "(untitled)",
        body: "",
        projectId,
        status: ItemStatus.Todo,
        type: ItemType.Bug,
        creatorUserId: session.userId,
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
