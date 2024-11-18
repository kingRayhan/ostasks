import { DrizzleService } from '@/shared/persistence/drizzle/drizzle.service';
import {
  DatabaseTableName,
  drizzleSchemaTableMap,
} from '@/shared/persistence/drizzle/schemas';
import { eq } from 'drizzle-orm';
import {
  AppPaginationResponseDto,
  IPagination,
  IPersistentFilterPayload,
} from '@/shared/persistence/persistence.contract';
import {
  buildOrderByClause,
  buildWhereClause,
} from '@/shared/persistence/utils/persistent-utils';

/**
 * BaseDatabaseService
 *
 * This class is used to perform basic CRUD operations on the database.
 * It provides methods to create, update, and delete records in the database.
 *
 * @template DOMAIN_MODEL_TYPE - The type of the domain model that this service is responsible for.
 */
export abstract class PersistentRepository<DOMAIN_MODEL_TYPE> {
  protected constructor(
    public readonly drizzleService: DrizzleService,
    public readonly tableName: DatabaseTableName,
  ) {}

  async findAllWithPagination(
    payload: IPagination<DOMAIN_MODEL_TYPE>,
  ): Promise<AppPaginationResponseDto<DOMAIN_MODEL_TYPE>> {
    const _limit = payload.limit || 10;
    const _page = payload.page || 1;
    const _offset = (_page - 1) * _limit;

    // Raw SQL for the total count
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM ${this.tableName};
    `;

    // Execute the main query
    const nodes = await this.findRows({
      limit: _limit,
      offset: _offset,
      columns: payload?.columns || [],
      filters: payload?.filters || [],
      orderBy: payload?.orderBy || [],
    });

    // Execute the count query
    const totalCountResult =
      await this.drizzleService.drizzle.execute(countQuery);
    const totalCount = (totalCountResult.rows[0].count as number) || 0;

    return {
      nodes: nodes as DOMAIN_MODEL_TYPE[],
      meta: {
        totalCount,
        currentPage: _page,
        hasNextPage: _page * _limit < totalCount,
        totalPages: Math.ceil(totalCount / _limit),
      },
    };
  }

  /**
   * Finds rows in the database based on the provided filter criteria.
   * @param payload
   */
  async findRows(payload: IPersistentFilterPayload<DOMAIN_MODEL_TYPE>) {
    // Default columns to '*' if none are provided
    const columns = payload.columns?.length
      ? payload.columns.map((c) => `"${c.toString()}"`).join(', ')
      : '*';

    console.log('columns', columns);
    const { whereClause, values } = buildWhereClause(payload.filters);
    let orderByClause = buildOrderByClause(payload.orderBy);

    // Build the SQL query with LIMIT, OFFSET, and ORDER BY
    const limit = payload.limit ?? 10; // Default limit to 10 if not provided
    const offset = payload.offset ?? 0; // Default offset to 0 if not provided

    // Build the final SQL query
    const sqlQuery = `
      SELECT ${columns}
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ${orderByClause ? `ORDER BY ${orderByClause}` : ''}
      ${limit ? `LIMIT ${limit}` : ''} ${offset ? `OFFSET ${offset}` : ''};
    `;

    // Execute the SQL query
    const result = await this.executeSQL(sqlQuery, values);
    return result.rows as DOMAIN_MODEL_TYPE[];
  }

  /**
   * Finds the count of rows in the database based on the provided filter criteria.
   * @param payload
   */
  async findRowCount(
    payload: IPersistentFilterPayload<DOMAIN_MODEL_TYPE>,
  ): Promise<number> {
    // // if (payload.filters.length === 0) {
    // //   throw new Error('At least one filter must be provided.');
    // // }
    //
    // // Build the WHERE clause with the specified logical operator
    // const whereClauses = payload.filters.map(
    //   (filter, index) => `"${filter.key}" ${filter.operator} '${filter.value}'`,
    // );
    // const whereClause = whereClauses.join(
    //   ` ${payload.logicalOperator || 'and'} `,
    // );
    //
    // // Construct the SQL query
    // const query = `
    //   SELECT COUNT(*)
    //   FROM ${this.tableName}
    //   WHERE ${whereClause};
    // `;
    //
    // const result = await this.drizzleService.drizzle.execute(query);
    // return result.rows[0].count as number;

    return 0;
  }

  /**
   * Creates a new record in the database.
   *
   * @param data - The data to be inserted.
   * @returns The newly created record.
   */
  async createOne(
    data: Partial<DOMAIN_MODEL_TYPE>,
  ): Promise<DOMAIN_MODEL_TYPE> {
    const result = await this.drizzleService.drizzle
      .insert(drizzleSchemaTableMap[this.tableName])
      .values(data as any)
      .returning();

    return result[0] as DOMAIN_MODEL_TYPE;
  }

  /**
   * Creates multiple records in the database.
   *
   * @param data
   */
  async createMany(
    data: Partial<DOMAIN_MODEL_TYPE>[],
  ): Promise<DOMAIN_MODEL_TYPE[]> {
    const result = await this.drizzleService.drizzle
      .insert(drizzleSchemaTableMap[this.tableName])
      .values(data)
      .returning();

    return result as DOMAIN_MODEL_TYPE[];
  }

  async deleteOne(id: string): Promise<DOMAIN_MODEL_TYPE> {
    const result = await this.drizzleService.drizzle
      .delete(drizzleSchemaTableMap[this.tableName])
      .where(eq(drizzleSchemaTableMap[this.tableName].id, id))
      .returning();
    return result[0] as DOMAIN_MODEL_TYPE;
  }

  async updateOne(
    id: string,
    data: Partial<DOMAIN_MODEL_TYPE>,
  ): Promise<DOMAIN_MODEL_TYPE> {
    const result = await this.drizzleService.drizzle
      .update(drizzleSchemaTableMap[this.tableName])
      .set(data)
      .where(eq(drizzleSchemaTableMap[this.tableName].id, id))
      .returning();
    return result[0] as DOMAIN_MODEL_TYPE;
  }

  //------------------------------------
  // Utils
  //------------------------------------
  buildSelectFields(fields: string[]) {
    return fields.reduce((acc, field) => {
      acc[field] = drizzleSchemaTableMap[this.tableName][field];
      return acc;
    }, {} as any);
  }

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  executeSQL(sql: string, values: any[]) {
    function buildSafeQuery(sql: string, values: any[]): string {
      return sql.replace(/\$(\d+)/g, (_, index) => {
        const value = values[parseInt(index, 10) - 1];
        return escapeValue(value);
      });
    }

    // Escapes a single value safely
    function escapeValue(value: any): string {
      if (value === null) return 'NULL';
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
      if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
      throw new Error(`Unsupported value type: ${typeof value}`);
    }

    const safeSql = buildSafeQuery(sql, values);
    return this.drizzleService.drizzle.execute(safeSql);
  }
}
