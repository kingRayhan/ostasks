import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";
import { projects } from "@/backend/persistence/schema";
import { desc, eq } from "drizzle-orm";
import ProjectsPage from "./components/ProjectsPage";

const getProjects = async () => {
  const authSession = await getAuthSession();
  const projectResult = await db.query.projects.findMany({
    limit: 10,
    orderBy: [desc(projects.createdAt)],
    columns: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      creator: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
    where: eq(projects.creatorUserId, authSession?.userId as string),
  });

  return projectResult;
};

export const dynamic = "force-dynamic";

const page = async () => {
  const projectResult = await getProjects();
  return <ProjectsPage initialProjects={projectResult as any} />;
};

export default page;
