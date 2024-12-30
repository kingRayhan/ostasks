import React from "react";
import { db } from "@/backend/persistence/db";
import { getAuthSession } from "@/app/api/api-utils";
import { eq } from "drizzle-orm";
import { projects } from "@/backend/persistence/schema";
import ProjectSettingsPage from "./_components/ProjectSettingsPage";

const getProjectDetailsFromDatabase = async (projectId: string) => {
  const authSession = await getAuthSession();
  if (!authSession?.userId) throw new Error("Unauthorized");

  const result = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  return result;
};

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const page: React.FC<Props> = async ({ params }) => {
  const _params = await params;
  return (
    <>
      <ProjectSettingsPage
        project={
          (await getProjectDetailsFromDatabase(_params.projectId)) as any
        }
      />
    </>
  );
};

export default page;
