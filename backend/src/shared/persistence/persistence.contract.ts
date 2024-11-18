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
export interface IPagination<T> {
  page?: number;
  limit?: number;
  filters?: Array<
    | IPersistentFilter<T>
    | { or?: IPersistentFilter<T>[]; and?: IPersistentFilter<T>[] }
  >;
  columns?: Array<keyof T>;
  orderBy?: Array<IPersistentOrderBy<T>>;
}

//------------------------------------
// Find
//------------------------------------
export interface IPersistentFilter<T> {
  key: keyof T;
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
}
export interface IPersistentOrderBy<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface IPersistentFilterPayload<T> {
  filters: Array<
    | IPersistentFilter<T>
    | { or?: IPersistentFilter<T>[]; and?: IPersistentFilter<T>[] }
  >;
  orderBy?: Array<IPersistentOrderBy<T>>;
  columns?: Array<keyof T>;
  limit?: number;
  offset?: number;
}
