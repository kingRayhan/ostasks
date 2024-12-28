// actions/projects.ts
"use server";

import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";
import { projects } from "@/backend/persistence/schema";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

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

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
};
