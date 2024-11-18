import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IPersistentFilter,
  IPersistentOrderBy,
} from '@/shared/persistence/persistence.contract';

@InputType()
export class CommonPaginationInput {
  @Field(() => Int, { nullable: true })
  // @IsOptional()
  page: number;

  @Field(() => Int, { nullable: true })
  // @IsOptional()
  limit: number;

  // filters: Array<
  //   | IPersistentFilter<T>
  //   | { or?: IPersistentFilter<T>[]; and?: IPersistentFilter<T>[] }
  // >;
  //
  // orderBy?: Array<IPersistentOrderBy<T>>;
}

// export class CommonPaginationOrderByInput {
//   @Field(() => String, { nullable: true })
//   // @IsOptional()
//   key: keyof T;
//
//   @Field(() => String, { nullable: true })
//   // @IsOptional()
//   direction: 'asc' | 'desc';
// }
