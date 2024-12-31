// app/api/projects/route.ts

import { db } from "@/backend/persistence/db";
import { projects } from "@/backend/persistence/schema";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthSession } from "../api-utils";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Get all query parameters with defaults
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const authSession = await getAuthSession();
  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Build where conditions
  let whereConditions: any[] = [
    eq(projects.creatorUserId, authSession.userId as string),
  ];

  if (search) {
    whereConditions.push(
      or(
        ilike(projects.title, `%${search}%`),
        ilike(projects.description, `%${search}%`)
      )
    );
  }

  if (status !== "all") {
    whereConditions.push(eq(projects.status, status));
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  const sortOrder =
    order === "desc"
      ? desc(projects[sort as keyof typeof projects] as any)
      : asc(projects[sort as keyof typeof projects] as any);

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(and(...whereConditions))
    .execute();

  const items = await db.query.projects.findMany({
    limit,
    offset,
    orderBy: [sortOrder],
    where: and(...whereConditions),
    columns: {
      id: true,
      title: true,
      description: true,
      logoUrl: true,
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
  });

  return NextResponse.json({
    meta: {
      total: Number(count[0].count),
      page,
      limit,
      authSession,
    },
    items,
  });
};
