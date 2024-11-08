import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page Size',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  pageSize: number;

  @ApiProperty({
    description:
      'Cursor to be added to go to next page if `hasNextPage` is true',
    example: 'cursor_value',
    required: false,
  })
  @IsOptional()
  cursor?: string;
}
