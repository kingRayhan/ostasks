import { ItemGroupInput, itemGroups } from "@/backend/persistence/schema";

import { db } from "@/backend/persistence/db";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/app/api/api-utils";

export const createItemGroup = async (
  input: ItemGroupInput,
  _revalidatePath = "/"
) => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) throw new Error("Unauthorized");

    await db.insert(itemGroups).values(input);
    revalidatePath(_revalidatePath);
    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create item group:", error);
    return { success: false, error: "Failed to create item group" };
  }
};
