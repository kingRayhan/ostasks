import { DrizzleService } from '@/shared/persistence/drizzle/drizzle.service';
import {
  DatabaseTableName,
  drizzleSchemaTableMap,
} from '@/shared/persistence/drizzle/schemas';
import { eq } from 'drizzle-orm';
import {
  AppPaginationResponseDto,
  IPagination,
} from '@/shared/persistence/persistence.contract';

/**
 * BaseDatabaseService
 *
 * This class is used to perform basic CRUD operations on the database.
 * It provides methods to create, update, and delete records in the database.
 *
 * @template DOMAIN_MODEL_TYPE - The type of the domain model that this service is responsible for.
 */
export abstract class BaseDatabaseService<DOMAIN_MODEL_TYPE> {
  protected constructor(
    public readonly drizzleService: DrizzleService,
    public readonly tableName: DatabaseTableName,
  ) {}

  async findAllWithPagination(
    payload: IPagination,
  ): Promise<AppPaginationResponseDto<DOMAIN_MODEL_TYPE>> {
    // const _limit = payload.limit || 10;
    // const _page = payload.page || 1;
    // const _offset = (_page - 1) * _limit;
    //
    // const result = await this.drizzleService.drizzle
    //   .select(this.buildSelectFields(payload.fields) as any)
    //   .from(drizzleSchemaTableMap[this.tableName])
    //   .limit(_limit)
    //   .offset(_offset);
    //
    // const totalCountQuery = await this.drizzleService.drizzle.execute(
    //   `SELECT COUNT(*) FROM ${this.tableName}`,
    // );
    // const totalCount = totalCountQuery.rows[0].count as number;
    //
    // return {
    //   nodes: result as DOMAIN_MODEL_TYPE[],
    //   meta: {
    //     totalCount: totalCount,
    //     currentPage: _page,
    //     hasNextPage: totalCount > _limit,
    //     totalPages: Math.ceil(totalCount / _limit),
    //   },
    // };

    const _limit = payload.limit || 10;
    const _page = payload.page || 1;
    const _offset = (_page - 1) * _limit;

    // Raw SQL for the main query
    const fields =
      payload.fields?.map((field) => `"${field}"`).join(', ') || '*';

    const mainQuery = `
    SELECT ${fields} 
    FROM ${this.tableName} 
    LIMIT ${_limit} 
    OFFSET ${_offset};
  `;

    // Raw SQL for the total count
    const countQuery = `
    SELECT COUNT(*) as count 
    FROM ${this.tableName};
  `;

    // Execute the main query
    const result = await this.drizzleService.drizzle.execute(mainQuery);

    // Execute the count query
    const totalCountResult =
      await this.drizzleService.drizzle.execute(countQuery);
    const totalCount = (totalCountResult.rows[0].count as number) || 0;

    return {
      nodes: result.rows as DOMAIN_MODEL_TYPE[],
      meta: {
        totalCount,
        currentPage: _page,
        hasNextPage: _page * _limit < totalCount,
        totalPages: Math.ceil(totalCount / _limit),
      },
    };
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
}
