import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PaginationQueryDto } from './dto/query-dto';
import {
  OrgGraphQlResponse,
  FormatedRepository,
  OrgPaginationResponse,
  UnformattedRepsoitory,
} from 'src/utils/types';
import { lastValueFrom } from 'rxjs';
import { OrganizationRepository } from './org.repository';
import { SelectRepositoryDto } from './dto/select-repository.dto';
import { OrgRepository } from './schema/org-repo.schema';

@Injectable()
export class OrganizationService {
  private githubGraphqlUrl = 'https://api.github.com/graphql';
  protected readonly logger = new Logger(OrganizationService.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private readonly orgRepository: OrganizationRepository,
  ) {}

  async fetchOrgRepositories(
    org: string,
    query: PaginationQueryDto,
  ): Promise<OrgPaginationResponse<FormatedRepository>> {
    const token = this.configService.get<string>('GITHUB_TOKEN');

    const graphqlQuery = `
     query($org: String!, $repoLimit: Int!, $branchLimit: Int!, $after: String) {
        organization(login: $org) {
          id
          repositories(first: $repoLimit, after: $after) {
            nodes {
              id
              name
              url
              languages(first: 100) {
                nodes {
                  name
                }
              }
              refs(first: $branchLimit, refPrefix: "refs/heads/") {
                totalCount
                nodes {
                  name
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    `;

    const variables = {
      org,
      repoLimit: parseInt(query.pageSize.toString(), 10),
      branchLimit: parseInt(query.pageSize.toString(), 10),
      after: query.cursor,
    };

    this.logger.log(`Fetching response from github for org ${org} `);

    const response: OrgGraphQlResponse = await lastValueFrom(
      this.httpService.post(
        this.githubGraphqlUrl,
        { query: graphqlQuery, variables },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );

    if (response.data.errors?.length) {
      this.logger.log(`Throwing error from github response for org ${org}`);
      this.logger.error(response.data.errors);
      throw new BadRequestException(
        `Unable to fetch repositories under ${org}`,
      );
    }

    const repositoriesPageInfo =
      response.data.data.organization.repositories.pageInfo;

    this.logger.log(`Formatting response from github for org ${org}`);

    const repositories = response.data.data.organization.repositories.nodes.map(
      (repo) => ({
        name: repo.name,
        url: repo.url,
        language: repo.languages.nodes.map((x: { name: string }) => x.name),
        branchCount: repo.refs.totalCount,
        branches: repo.refs.nodes.map((x: { name: string }) => x.name),
        id: repo.id,
      }),
    );

    const repoIds = repositories.map((repo) => repo.id);
    const orgId = response.data.data.organization.id;

    this.logger.log(
      `Checking for existing selected repos from db for repository ids:`,
      repoIds,
    );

    const selectedRepoMap = await this.fetchRepositorySelection(repoIds, orgId);

    this.logger.log(
      'Assigning existing selected state to corresponding repositories',
    );
    const updatedRepositories = this.formattingGithubResponse(
      selectedRepoMap,
      repositories,
    );

    return {
      orgId: orgId,
      list: updatedRepositories,
      size: query.pageSize,
      hasNextPage: repositoriesPageInfo.hasNextPage,
      endCursor: repositoriesPageInfo.endCursor,
    };
  }

  private async fetchRepositorySelection(repoIds: string[], orgId: string) {
    const existingRepos = await this.orgRepository.find({
      repositoryId: { $in: repoIds },
      organizationId: orgId,
      selected: true,
    });
    return existingRepos.reduce((map, repo) => {
      map[repo.repositoryId] = repo.selected;
      return map;
    }, {});
  }

  private formattingGithubResponse(
    selectedRepoMap: Record<string, boolean>,
    repositories: UnformattedRepsoitory[],
  ): FormatedRepository[] {
    return repositories.map((repo) => ({
      ...repo,
      selected: selectedRepoMap[repo.id] ?? false,
    }));
  }

  async saveRepoSelection(
    organizationId: string,
    { repositoryId, selection }: SelectRepositoryDto,
  ): Promise<OrgRepository> {
    this.logger.log('Updating repsoitory selection state in db');
    return await this.orgRepository.findOneAndUpdate(
      {
        organizationId,
        repositoryId,
      },
      { selected: selection },
      {
        new: true,
        upsert: true,
        lean: false,
      },
    );
  }
}
