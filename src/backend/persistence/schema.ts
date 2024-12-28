// db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  auth_uid: text("auth_uid").unique(),
  username: text("username").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  email: text("email"),
  lastSynced: timestamp("last_synced").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  status: text("status").default("active"),
  creatorUserId: uuid("creator_userid").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export type Project = typeof projects.$inferSelect;

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.creatorUserId],
    references: [users.id],
  }),
  allowedUsers: many(projectsToUsers),
  items: many(items),
}));

export const projectsToUsers = pgTable("projects_to_users", {
  projectId: uuid("project_id").references(() => projects.id),
  userId: uuid("user_id").references(() => users.id),
});

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  body: text("body"),
  projectId: uuid("project_id").references(() => projects.id),
  userId: uuid("creator_userid").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body"),
  itemId: uuid("item_id").references(() => items.id),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
// export const usersRelations = relations(users, ({ many }) => ({
//   projects: many(projectsToUsers),
//   createdProjects: many(projects, {
//     relationName: "created_projects",
//   }),
// }));

export const itemsRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [items.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  item: one(items, {
    fields: [comments.itemId],
    references: [items.id],
  }),
  creator: one(users, {
    fields: [comments.createdById],
    references: [users.id],
  }),
}));
