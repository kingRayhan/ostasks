import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CommonPaginationInput {
  @Field(() => Int, { nullable: true })
  // @IsOptional()
  page: number;

  @Field(() => Int, { nullable: true })
  // @IsOptional()
  limit: number;

  // @Field(() => SortType, { nullable: true })
  // @IsOptional()
  // sort?: SortType;
  //
  // @Field(() => String, { nullable: true })
  // @IsOptional()
  // sortBy?: string;
  //
  // @Field(() => [CommonFindDocumentDto], { nullable: true })
  // @IsOptional()
  // filters?: CommonFindDocumentDto[];
  //
  // @Field(() => WHERE_OPERATOR, { nullable: true })
  // @IsOptional()
  // filterOperator?: WHERE_OPERATOR;
}
