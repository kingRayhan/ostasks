import React from "react";
import ItemEditorForm from "./_components/ItemEditorForm";
import { db } from "@/backend/persistence/db";
import { and, eq, sql } from "drizzle-orm";
import { items } from "@/backend/persistence/schema";
import { updateItem } from "@/actions/items.action";
import toast from "react-hot-toast";

const getItemDetails = async (itemId: string) => {
  const item = await db.query.items.findFirst({
    where: eq(items.id, itemId),
  });
  return item;
};

interface Props {
  params: Promise<{
    projectId: string;
    itemId: string;
  }>;
}

const page: React.FC<Props> = async ({ params }) => {
  const { projectId, itemId } = await params;
  return (
    <div className="container mx-auto my-10">
      <ItemEditorForm
        item={(await getItemDetails(itemId)) as any}
        projectId={projectId}
      />
    </div>
  );
};

export default page;
