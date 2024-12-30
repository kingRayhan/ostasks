// db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  uuid,
  pgEnum,
  integer,
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
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  status: varchar("status").default("active"),
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

export enum ItemType {
  Bug = "bug",
  Feature = "feature",
  Improvement = "improvement",
}
export enum ItemStatus {
  Todo = "todo",
  InProgress = "in-progress",
  InReview = "in-review",
  Closed = "closed",
}
export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  status: varchar("status", { length: 255 }),
  type: varchar("type", { length: 255 }),
  serialNumber: integer("serial_number"),
  body: text("body"),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  creatorUserId: uuid("creator_userid").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export type ProjectItem = typeof items.$inferSelect;

export const itemGroups = pgTable("item_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export type ItemGroup = typeof itemGroups.$inferSelect;
export type ItemGroupInput = typeof itemGroups.$inferInsert;

// Join Table for Item-Group Relations
export const itemGroupRelations = pgTable("item_group_relations", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("item_id").references(() => items.id, {
    onDelete: "cascade", // Remove relation if the item is deleted
  }),
  groupId: uuid("group_id").references(() => itemGroups.id, {
    onDelete: "cascade", // Remove relation if the group is deleted
  }),
  createdAt: timestamp("created_at").defaultNow(),
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

//------------------------------------------------------------------------------
// Relations
//------------------------------------------------------------------------------
export const itemGroupsRelations = relations(itemGroups, ({ one, many }) => ({
  project: one(projects, {
    fields: [itemGroups.projectId],
    references: [projects.id],
  }),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [items.creatorUserId],
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
