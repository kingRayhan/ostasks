//--------------------------------------------------------------------------------
// ------   user__project pivot table
//--------------------------------------------------------------------------------
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { commonTimestampColumns } from './common.schema';
import { userTable } from './user.schema';
import { projectTable } from './project.schema';
import { relations } from 'drizzle-orm';

export const userProjectPivotTable = pgTable('user__project', {
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  projectId: uuid()
    .notNull()
    .references(() => projectTable.id, { onDelete: 'cascade' }),
  ...commonTimestampColumns,
});

export const userProjectRelation = relations(
  userProjectPivotTable,
  ({ one }) => ({
    project: one(projectTable, {
      fields: [userProjectPivotTable.projectId],
      references: [projectTable.id],
    }),
    user: one(userTable, {
      fields: [userProjectPivotTable.userId],
      references: [userTable.id],
    }),
  }),
);
