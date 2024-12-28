export interface PaginatedResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  items: T[];
}
