//--------------------------------------------------------------------------------
// ------   user__project pivot table
//--------------------------------------------------------------------------------
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { commonTimestampColumns } from './common.schema';
import { userTable } from './user.schema';
import { projectTable } from './project.schema';

export const userProjectPivotTable = pgTable('user__project', {
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  projectId: uuid()
    .notNull()
    .references(() => projectTable.id, { onDelete: 'cascade' }),
  ...commonTimestampColumns,
});
