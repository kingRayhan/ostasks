// actions/projects.ts
"use server";

import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";
import { projects } from "@/backend/persistence/schema";
import { eq } from "drizzle-orm";

import { revalidatePath, revalidateTag } from "next/cache";

// Define the input type separately from the database type
type CreateProjectInput = {
  title: string;
  description?: string;
  status: "active" | "on-hold" | "completed";
};

export const createProject = async (input: CreateProjectInput) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    await db.insert(projects).values({
      title: input.title,
      description: input.description,
      status: input.status,
      creatorUserId: session?.userId,
    });

    revalidateTag("projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    await db.delete(projects).where(eq(projects.id, projectId));

    revalidateTag("projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
};
