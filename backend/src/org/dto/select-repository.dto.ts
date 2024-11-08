import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SelectRepositoryDto {
  @ApiProperty({
    description: 'ID of repository to be updated',
    example: 'MDEwOlJlcG9zaXRvcnkxOTMyMDgz',
    required: true,
  })
  @IsNotEmpty()
  repositoryId: string;

  @ApiProperty({
    description: 'Update repo state to be either checked or not',
    example: true,
    required: true,
  })
  @IsNotEmpty()
  selection: boolean;
}
