import { ApiProperty } from '@nestjs/swagger';

export class ResponseOnBadRequestOrganization {
  @ApiProperty({
    type: 'number',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Код организации не верный',
  })
  message: string;
}
