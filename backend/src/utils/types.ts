import { ApiProperty } from '@nestjs/swagger';

export type OrgPaginationResponse<T> = {
  list: T[];
  size: number;
  hasNextPage: boolean;
  endCursor: string;
  orgId: string;
};

export type GithubRepoList = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: '';
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: 'User';
    site_admin: boolean;
  };
  html_url: string;
  url: string;
  language: string | null;
  private: boolean;
  description: string;
  fork: false;
  branches_url: string;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  is_template: boolean;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: 'public' | 'private';
  pushed_at: string;
  created_at: string;
  updated_at: string;
};

export type GithubResponse<T> = {
  data: T[];
};

export type GithubOrgResponse = {
  id: string;
  repositories: {
    nodes: [
      {
        id: string;
        name: string;
        url: string;
        languages: {
          nodes: { name: string }[];
        };
        refs: {
          nodes: { name: string }[];
          totalCount: number;
          pageInfo: {
            endCursor: string;
            hasNextPage: boolean;
          };
        };
      },
    ];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
};

export type OrgGraphQlResponse = {
  data: {
    errors?: {
      type: string;
      message: string;
    }[];
    data: {
      organization: GithubOrgResponse;
    };
  };
};

export type FormatedRepository = UnformattedRepsoitory & {
  selected: boolean;
};

export type UnformattedRepsoitory = {
  name: string;
  url: string;
  language: string[];
  branchCount: number;
  branches: string[];
  id: string;
};

export class SuccessResponseDto<T> {
  data!: T;

  @ApiProperty({
    type: String,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
  })
  message: string;
}
