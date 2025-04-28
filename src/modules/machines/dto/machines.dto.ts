import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class RequestInputDataForGetMachineListDTO {
  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Массив идентификаторов классов машин (необязательно)',
  })
  machineClassIds: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Массив идентификаторов типов машин (необязательно)',
  })
  machineTypeIds: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Массив идентификаторов марок машин (необязательно)',
  })
  machineMarkIds;

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Массив идентификаторов машин (необязательно)',
  })
  machineIds: number[];
}
