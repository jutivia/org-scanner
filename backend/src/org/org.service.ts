import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PaginationQueryDto } from './dto/query-dto';
import {
  OrgGraphQlResponse,
  FormatedRepository,
  OrgPaginationResponse,
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
      this.logger.error(response.data.errors);
      throw new BadRequestException(
        `Unable to fetch repositories under ${org}`,
      );
    }

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

    const repositoriesPageInfo =
      response.data.data.organization.repositories.pageInfo;

    const repoIds = repositories.map((repo) => repo.id);
    const existingRepos = await this.orgRepository.find({
      repositoryId: { $in: repoIds },
      organizationId: response.data.data.organization.id,
      selected: true,
    });

    const selectedRepoMap = existingRepos.reduce((map, repo) => {
      map[repo.repositoryId] = repo.selected;
      return map;
    }, {});

    const updatedRepositories = repositories.map((repo) => ({
      ...repo,
      selected: selectedRepoMap[repo.id] ?? false,
    }));

    return {
      orgId: response.data.data.organization.id,
      list: updatedRepositories,
      size: query.pageSize,
      hasNextPage: repositoriesPageInfo.hasNextPage,
      endCursor: repositoriesPageInfo.endCursor,
    };
  }

  async saveRepoSelection(
    organizationId: string,
    { repositoryId, selection }: SelectRepositoryDto,
  ): Promise<OrgRepository> {
    try {
      return await this.orgRepository.findOneAndUpdate(
        {
          organizationId,
          repositoryId,
        },
        { selected: selection },
      );
    } catch (error) {
      return await this.orgRepository.create({
        organizationId,
        repositoryId,
        selected: selection,
      });
    }
  }
}
