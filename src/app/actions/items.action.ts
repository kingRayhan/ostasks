"use server";

import { db } from "@/backend/persistence/db";
import { getAuthSession } from "../api/api-utils";
import { items, Project } from "@/backend/persistence/schema";

export const bootstrapItem = async (projectId: string) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    const result = await db.insert(items).values({
      title: "(untitled)",
      body: "",
      projectId,
      creatorUserId: session.userId,
    });

    return {
      success: true,
      error: null,
      itemId: (result.rows[0] as Project).id,
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
