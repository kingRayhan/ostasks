// app/api/projects/route.ts

import { db } from "@/backend/persistence/db";
import { items } from "@/backend/persistence/schema";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthSession } from "../api-utils";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Get all query parameters with defaults
  const page = parseInt(searchParams.get("page") || "1");
  const projectId = searchParams.get("projectId") || "";
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const authSession = await getAuthSession();
  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Build where conditions
  let whereConditions: any[] = [
    // eq(items.creatorUserId, authSession.userId as string),
    // eq(items.projectId, projectId as string),
  ];

  if (projectId) {
    whereConditions.push(eq(items.projectId, projectId as string));
  }

  if (search) {
    whereConditions.push(
      or(ilike(items.title, `%${search}%`), ilike(items.body, `%${search}%`))
    );
  }

  if (status !== "") {
    whereConditions.push(eq(items.status, status));
  }
  if (type !== "") {
    whereConditions.push(eq(items.type, type));
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  const sortOrder =
    order === "desc"
      ? desc(items[sort as keyof typeof items] as any)
      : asc(items[sort as keyof typeof items] as any);

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(and(...whereConditions))
    .execute();

  const _items = await db.query.items.findMany({
    limit,
    offset,
    orderBy: [sortOrder],
    where: and(...whereConditions),
    columns: {
      id: true,
      title: true,
      // body: true,
      status: true,
      type: true,
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
    items: _items,
  });
};
