// org.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './org.controller';
import { OrganizationService } from './org.service';
import { PaginationQueryDto } from './dto/query-dto';
import { SelectRepositoryDto } from './dto/select-repository.dto';

describe('OrganizationController', () => {
  let controller: OrganizationController;
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        {
          provide: OrganizationService,
          useValue: {
            fetchOrgRepositories: jest.fn(),
            saveRepoSelection: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should return repositories on GET', async () => {
    const queryDto: PaginationQueryDto = { pageSize: 10, cursor: '' };
    jest.spyOn(service, 'fetchOrgRepositories').mockResolvedValue({
      list: [],
      orgId: '',
      hasNextPage: false,
      endCursor: '',
      size: 10,
    });
    const result = await controller.getRepositories('org-name', queryDto);

    expect(result).toBeDefined();
    expect(service.fetchOrgRepositories).toHaveBeenCalledWith(
      'org-name',
      queryDto,
    );
  });

  it('should update repository selection on PATCH', async () => {
    const dto: SelectRepositoryDto = {
      repositoryId: 'repo-id',
      selection: true,
    };
    jest
      .spyOn(service, 'saveRepoSelection')
      .mockResolvedValue({ id: 'repo-id' } as any);

    const result = await controller.updateReositorySelection('org-id', dto);
    expect(result).toBeDefined();
    expect(service.saveRepoSelection).toHaveBeenCalledWith('org-id', dto);
  });
});
