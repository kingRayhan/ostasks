import React from "react";
import ProjectDashboardPage from "./_components/ProjectDashboardPage";
import { NextPage } from "next";
import { getAuthSession } from "@/app/api/api-utils";
import { db } from "@/backend/persistence/db";
import { and, eq, sql } from "drizzle-orm";
import { items, itemStatus } from "@/backend/persistence/schema";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const getProjectItemMatrixFromDatabase = async (projectId: string) => {
  const authSession = await getAuthSession();

  const allCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(eq(items.projectId, projectId))
    .execute();

  const todoCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(eq(items.projectId, projectId), eq(items.status, itemStatus.Todo))
    )
    .execute();

  const inProgressCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(
        eq(items.projectId, projectId),
        eq(items.status, itemStatus.InProgress)
      )
    )
    .execute();

  const inReviewCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(eq(items.projectId, projectId), eq(items.status, itemStatus.InReview))
    )
    .execute();

  const closedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(
      and(eq(items.projectId, projectId), eq(items.status, itemStatus.Closed))
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

const page: NextPage<Props> = async ({ params }) => {
  const _params = await params;

  return (
    <ProjectDashboardPage
      projectId={_params.projectId}
      matrix={await getProjectItemMatrixFromDatabase(_params.projectId)}
    />
  );
};

export default page;
