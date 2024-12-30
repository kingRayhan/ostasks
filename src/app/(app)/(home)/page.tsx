import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";
import { projects } from "@/backend/persistence/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextPage } from "next";
import ProjectsPage from "./components/ProjectsPage";

const getProjectsFromDatabase = async (
  page: number = 1,
  limit: number = 10
) => {
  const authSession = await getAuthSession();
  const offset = (page - 1) * limit;

  const projectResult = await db.query.projects.findMany({
    limit,
    offset,
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

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.creatorUserId, authSession?.userId as string))
    .execute();

  return {
    items: projectResult,
    meta: {
      limit,
      page: page,
      total: Number(count[0].count),
    },
  };
};

interface ProjectsPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

const page: NextPage<ProjectsPageProps> = async (props) => {
  const query = await props.searchParams;
  const ssrPaginatedProjects = await getProjectsFromDatabase(
    +query?.page || 1,
    9
  );

  return (
    <>
      <ProjectsPage hydratedPaginatedProjects={ssrPaginatedProjects as any} />
    </>
  );

  // return (
  //   <div className=" max-w-4xl mx-auto px-5">
  //     <div className="flex flex-col gap-4">
  //       <ClientForm />
  //       <ServerForm />
  //     </div>

  //     <h1 className="font-semibold">Server render</h1>
  //     <ul>
  //       {projects.items.map((project) => (
  //         <li>{project.title}</li>
  //       ))}
  //     </ul>

  //     <br />

  //     <MinimalProjectList paginatedProjects={projects as any} />
  //   </div>
  // );
};

export default page;
