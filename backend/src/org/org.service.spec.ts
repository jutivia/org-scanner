// org.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { OrganizationService } from './org.service';
import { OrganizationRepository } from './org.repository';
import { SelectRepositoryDto } from './dto/select-repository.dto';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpService: HttpService;
  let orgRepository: OrganizationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-github-token') },
        },
        {
          provide: OrganizationRepository,
          useValue: {
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    httpService = module.get<HttpService>(HttpService);
    orgRepository = module.get<OrganizationRepository>(OrganizationRepository);
  });

  it('should fetch organization repositories', async () => {
    const mockResponse = {
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

    jest.spyOn(orgRepository, 'find').mockResolvedValueOnce([]);
    jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse) as any);

    const result = await service.fetchOrgRepositories('org-name', {
      pageSize: 10,
      cursor: '',
    });
    expect(result).toBeDefined();
    expect(result.list[0].name).toEqual('Repo 1');
  });

  it('should return a repository with selected field as true if orgRepository.find returns it as selected', async () => {
    // Mock the response of the find method to include a repository with selected set to true
    const selectedRepositoryId = '123';
    jest.spyOn(orgRepository, 'find').mockResolvedValueOnce([
      {
        _id: new Types.ObjectId(),
        repositoryId: selectedRepositoryId,
        organizationId: 'org123',
        selected: true,
        __v: 0,
      },
    ]);

    // Mock the HTTP response from fetchOrgRepositories with matching repository data
    const httpResponse = {
      data: {
        data: {
          organization: {
            id: 'org123',
            repositories: {
              nodes: [
                {
                  id: selectedRepositoryId,
                  name: 'test-repo',
                  url: 'https://github.com/test-repo',
                  languages: { nodes: [{ name: 'JavaScript' }] },
                  refs: {
                    totalCount: 5,
                    nodes: [{ name: 'main' }],
                  },
                },
              ],
              pageInfo: { endCursor: null, hasNextPage: false },
            },
          },
        },
        errors: null,
      },
    };

    jest
      .spyOn(service['httpService'], 'post')
      .mockReturnValueOnce(of(httpResponse) as any);

    const query = { pageSize: 10, cursor: null };
    const result = await service.fetchOrgRepositories('org123', query);

    expect(result).toBeDefined();
    expect(result.list).toHaveLength(1);
    expect(result.list[0].id).toBe(selectedRepositoryId);

    // Check that the selected field is true
    expect(result.list[0].selected).toBe(true);
  });

  it('should handle error when fetching repositories', async () => {
    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(of({ data: { errors: ['Error'] } }) as any);
    await expect(
      service.fetchOrgRepositories('org-name', { pageSize: 10, cursor: '' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should save repository selection', async () => {
    const mockDto: SelectRepositoryDto = {
      repositoryId: 'repo-id',
      selection: true,
    };
    jest
      .spyOn(orgRepository, 'findOneAndUpdate')
      .mockResolvedValue({ id: 'repo-id' } as any);

    const result = await service.saveRepoSelection('org-id', mockDto);
    expect(result).toBeDefined();
    expect(orgRepository.findOneAndUpdate).toHaveBeenCalledWith(
      expect.any(Object),
      { selected: true },
    );
  });
});
