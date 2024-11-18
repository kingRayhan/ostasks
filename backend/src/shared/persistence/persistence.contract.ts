interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export class AppPaginationResponseDto<T> {
  nodes: T[];
  meta: PaginationMeta;

  constructor(data: any, meta: PaginationMeta) {
    this.meta = meta;
    this.nodes = data;
  }
}

//------------------------------------
// Pagination
//------------------------------------
export enum ISortType {
  ASC = 'ASC',
  DESC = 'DESC',
}
export interface IPagination {
  page: number;
  limit: number;
  fields?: string[];
  sort?: ISortType;
  sortBy?: string;
}

//------------------------------------
// Find
//------------------------------------
export interface IPersistentFilterPayload {
  filters: Array<{
    key: string;
    value: any;
    operator:
      | '='
      | '<'
      | '>'
      | '<='
      | '>='
      | '<>'
      | 'like'
      | 'ilike'
      | 'in'
      | 'not in';
  }>;
  columns?: string[];
  logicalOperator?: 'and' | 'or';
}
