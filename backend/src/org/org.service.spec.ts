import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { OrganizationService } from './org.service';
import { OrganizationRepository } from './org.repository';
import { SelectRepositoryDto } from './dto/select-repository.dto';
import { Types } from 'mongoose';
import {
  mockHttpResponse,
  mockServiceResponse,
  mockSelectionResponse,
} from './data';

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
    jest.spyOn(orgRepository, 'find').mockResolvedValueOnce([]);
    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(of(mockHttpResponse) as any);

    const result = await service.fetchOrgRepositories('org-name', {
      pageSize: 10,
      cursor: '',
    });
    expect(result).toBeDefined();
    expect(result).toEqual(mockServiceResponse);
  });

  it('should return a repository with selected field as true if orgRepository.find returns it as selected', async () => {
    const selectedRepositoryId = 'repo-id';
    const orgId = 'org-id';
    jest.spyOn(orgRepository, 'find').mockResolvedValueOnce([
      {
        _id: new Types.ObjectId(),
        repositoryId: selectedRepositoryId,
        organizationId: orgId,
        selected: true,
        __v: 0,
      },
    ]);
    jest
      .spyOn(service['httpService'], 'post')
      .mockReturnValueOnce(of(mockHttpResponse) as any);

    const query = { pageSize: 10, cursor: null };
    const result = await service.fetchOrgRepositories(orgId, query);

    expect(result).toBeDefined();
    expect(result.list).toHaveLength(1);
    expect(result.list[0].id).toBe(selectedRepositoryId);

    // Check that the selected field is true
    expect(result.list[0].selected).toBe(true);
  });

  it('should handle error when fetching repositories', async () => {
    const orgName = 'org-name';
    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(of({ data: { errors: ['Error'] } }) as any);
    await expect(
      service.fetchOrgRepositories(orgName, { pageSize: 10, cursor: '' }),
    ).rejects.toThrow(`Unable to fetch repositories under ${orgName}`);
  });

  it('should save repository selection', async () => {
    const mockDto: SelectRepositoryDto = {
      repositoryId: 'repo-id',
      selection: true,
    };
    jest
      .spyOn(orgRepository, 'findOneAndUpdate')
      .mockResolvedValue(mockSelectionResponse as any);

    const result = await service.saveRepoSelection('org-id', mockDto);
    expect(result.selected).toEqual(true);
  });
});
