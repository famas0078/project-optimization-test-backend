import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetRolesDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'User',
  })
  name: string;
}

export class ResponseGetOrganizationsDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'КТК',
  })
  name: string;
}

export class ResponseGetDataCurrentUserDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'object',
    properties: {
      id: {
        type: 'number',
        example: '1',
      },
      name: {
        type: 'string',
        example: 'name',
      },
    },
  })
  role: object;
}
