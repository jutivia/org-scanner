import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { OrganizationService } from './org.service';
import { PaginationQueryDto } from './dto/query-dto';
import { SelectRepositoryDto } from './dto/select-repository.dto';
import { successResponse } from 'src/utils/helpers';
import {
  FormatedRepository,
  OrgPaginationResponse,
  SuccessResponseDto,
} from 'src/utils/types';
import { OrgRepository } from './schema/org-repo.schema';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get(':name')
  async getRepositories(
    @Param('name') name: string,
    @Query() query: PaginationQueryDto,
  ): Promise<SuccessResponseDto<OrgPaginationResponse<FormatedRepository>>> {
    return successResponse(
      await this.organizationService.fetchOrgRepositories(name, query),
      { message: 'Repositories fetched successfully' },
    );
  }

  @Patch(':id')
  async updateReositorySelection(
    @Param('id') id: string,
    @Body() body: SelectRepositoryDto,
  ): Promise<SuccessResponseDto<OrgRepository>> {
    return successResponse(
      await this.organizationService.saveRepoSelection(id, body),
      { message: 'Repository updated successfully' },
    );
  }
}
