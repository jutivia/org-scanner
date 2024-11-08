
  export type IQueryKey =
  | "pageSize"
  | "cursor"


  export interface Iquery {
    pageSize: number;
    cursor?: string;
  }

  export type SuccessResponse<T> = {
    data: T;
    statusCode: number;
    message: string;
  }

  export type OrgPaginationResponse<T> = {
    list: T[];
    size: number;
    hasNextPage: boolean;
    endCursor: string;
    orgId: string;
  };

  export type Repository = {
    selected: boolean;
    name: string;
    url: string;
    language: string[];
    branchCount: number;
    branches: string[];
    id: string;
  };