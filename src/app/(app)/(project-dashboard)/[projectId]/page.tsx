import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";
import { items, ItemStatus } from "@/backend/persistence/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextPage } from "next";
import ProjectDashboardPage from "./_components/ProjectDashboardPage";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    page: string;
  }>;
}

const getProjectItemMatrixFromDatabase = async (projectId: string) => {
  const authSession = await getAuthSession();
  if (!authSession?.userId) throw new Error("Unauthorized");

  const allCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(eq(items.projectId, projectId))
    .execute();

  const todoCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(eq(items.projectId, projectId), eq(items.status, ItemStatus.Todo))
    )
    .execute();

  const inProgressCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(
        eq(items.projectId, projectId),
        eq(items.status, ItemStatus.InProgress)
      )
    )
    .execute();

  const inReviewCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(eq(items.projectId, projectId), eq(items.status, ItemStatus.InReview))
    )
    .execute();

  const closedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(eq(items.projectId, projectId), eq(items.status, ItemStatus.Closed))
    )
    .execute();

  return {
    allCount: Number(allCount[0].count),
    todoCount: Number(todoCount[0].count),
    inProgressCount: Number(inProgressCount[0].count),
    inReviewCount: Number(inReviewCount[0].count),
    closedCount: Number(closedCount[0].count),
  };
};

const getProjectItemsFromDatabase = async (
  projectId: string,
  page: number = 1,
  limit: number = 50
) => {
  // const authSession = await getAuthSession();
  // if (!authSession?.authUserId) throw new Error("Unauthorized");
  const itemsResult = await db.query.items.findMany({
    limit,
    offset: (page - 1) * limit,
    orderBy: [desc(items.createdAt)],
    columns: {
      id: true,
      title: true,
      status: true,
      type: true,
      createdAt: true,
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
    where: eq(items.projectId, projectId),
  });

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(eq(items.projectId, projectId))
    .execute();

  return {
    items: itemsResult,
    meta: {
      limit,
      page,
      total: Number(count[0].count),
    },
  };
};

const page: NextPage<Props> = async ({ params, searchParams }) => {
  const _params = await params;
  const _searchParams = await searchParams;
  const itemsResult = await getProjectItemsFromDatabase(
    _params.projectId,
    +_searchParams.page || 1,
    50
  );

  return (
    <ProjectDashboardPage
      projectId={_params.projectId}
      matrix={await getProjectItemMatrixFromDatabase(_params.projectId)}
      hydratedItems={itemsResult as any}
    />
  );
};

export default page;
