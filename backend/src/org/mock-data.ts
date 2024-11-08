export const mockHttpResponse = {
  data: {
    data: {
      organization: {
        id: 'org-id',
        repositories: {
          nodes: [
            {
              id: 'repo-id',
              name: 'Repo 1',
              url: 'http://url',
              refs: { totalCount: 1, nodes: [{ name: 'main' }] },
              languages: { nodes: [{ name: 'TypeScript' }] },
            },
          ],
          pageInfo: { hasNextPage: false, endCursor: 'cursor' },
        },
      },
    },
  },
};

export const mockServiceResponse = {
  orgId: 'org-id',
  list: [
    {
      selected: false,
      name: 'Repo 1',
      url: 'http://url',
      language: ['TypeScript'],
      branchCount: 1,
      branches: ['main'],
      id: 'repo-id',
    },
  ],
  size: 10,
  hasNextPage: false,
  endCursor: 'cursor',
};

export const mockSelectionResponse = {
  _id: 'mongo_id',
  organizationId: 'org-id',
  repositoryId: 'repo-id',
  __v: 0,
  selected: true,
};
