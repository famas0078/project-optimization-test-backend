import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseInputDataForVolumesDto {
  @ApiProperty({
    type: 'number',
    example: 2011,
  })
  year: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
  })
  month: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
  })
  quarter: number;

  @ApiProperty({
    type: 'number',
    example: 111,
  })
  extraction: number;

  @ApiProperty({
    type: 'number',
    example: 222,
  })
  overburden: number;

  @ApiProperty({
    type: 'string',
    examples: ['2011', '2011-Q1', '2011-01'],
  })
  combinedDate: string;

  @ApiProperty({
    type: 'number',
    example: 2,
  })
  coefficient: number;
}

class ObjectInputDataForParkProductivityDto {
  @ApiProperty({
    type: 'number',
    example: 2011,
  })
  year: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  month: number;

  @ApiProperty({
    type: 'string',
    example: '2011-01',
  })
  combinedDate: string;

  @ApiProperty({
    type: 'number',
    example: 1.3,
  })
  productivity: number;
}

export class ResponseClassInputDataForParkProductivityDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  machineClassId: number;

  @ApiProperty({
    type: 'string',
    example: 'Экскаваторы',
  })
  machineClassName: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForParkProductivityDto,
  })
  data: ObjectInputDataForParkProductivityDto[];
}

export class ResponseInputDataForParkProductivityDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  machineId: number;

  @ApiProperty({
    type: 'string',
    example: 'EX1200',
  })
  markName: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForParkProductivityDto,
  })
  data: ObjectInputDataForParkProductivityDto[];
}

class ObjectInputDataForUnitCostsDto {
  @ApiProperty({
    type: 'number',
    example: 2011,
  })
  year: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
  })
  month: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
  })
  quarter: number;

  @ApiProperty({
    type: 'string',
    examples: ['2011', '2011-Q1', '2011-01'],
  })
  combinedDate: string;

  @ApiProperty({
    type: 'number',
    example: 3,
  })
  totalCost: number;

  @ApiProperty({
    type: 'number',
    example: 2,
  })
  totalProductivity: number;

  @ApiProperty({
    type: 'number',
    example: 1.5,
  })
  costToProductivityRatio: number;
}

export class ResponseInputDataForUnitCostsDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    nullable: true,
  })
  kindId: number | null;

  @ApiProperty({
    type: 'string',
    example: 'Прочее',
  })
  markName: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForUnitCostsDto,
  })
  data: ObjectInputDataForUnitCostsDto[];
}

class ObjectInputDataForCostComparisonDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  kindId: number;

  @ApiProperty({
    type: 'string',
    example: 'Прочее',
  })
  kindName: string;

  @ApiProperty({
    type: 'number',
    example: 2000,
  })
  totalCost: number;
}
export class ResponseInputDataForCostComparisonDto {
  @ApiProperty({
    type: 'string',
    examples: ['actual', 'planned'],
  })
  type: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForCostComparisonDto,
  })
  costs: ObjectInputDataForCostComparisonDto[];
}

class ObjectInputDataForForOwnershipCostStructureDto {
  @ApiProperty({
    type: 'string',
    example: 'Удельная стоимость руб/м3',
  })
  type: string;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
  })
  specificCost?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
  })
  maintenanceAndRepairCosts?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
    description: 'Удельные затраты на Прочее',
  })
  otherCosts?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
    description: 'Удельные затраты на ФОТ и налоги',
  })
  laborAndTaxesCosts?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
    description: 'Удельные затраты на эксплуатацию',
  })
  fuelCosts?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
    description: 'ИТОГО удельные затраты на владение',
  })
  totalCost?: number;
}

export class ResponseInputDataForOwnershipCostStructureDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    nullable: true,
  })
  machineId: number;

  @ApiProperty({
    type: 'string',
    example: 'Прочее',
  })
  markName: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForForOwnershipCostStructureDto,
  })
  data: ObjectInputDataForForOwnershipCostStructureDto[];
}

class ObjectInputDataForForDynamicsOfUnitAccumulatedCostsDto {
  @ApiProperty({
    type: 'number',
    example: 2019,
  })
  combinedDate: number;

  @ApiProperty({
    type: 'number',
    example: 0,
    description: 'Производительность',
  })
  productivity: number;

  @ApiProperty({
    type: 'number',
    example: 0,
    description: 'Коэффициент затрат к производительности',
  })
  costToProductivityRatio: number;
}

export class ResponseInputDataForDynamicsOfUnitAccumulatedCostsDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    nullable: true,
  })
  machineId: number;

  @ApiProperty({
    type: 'string',
    example: 'lamborghini huracan',
  })
  markName: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForForDynamicsOfUnitAccumulatedCostsDto,
  })
  data: ObjectInputDataForForDynamicsOfUnitAccumulatedCostsDto[];
}

class ObjectInputDataForForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto {
  @ApiProperty({
    type: 'string',
    example: '1-Q1',
    nullable: true,
  })
  dataOperation: number;

  @ApiProperty({
    type: 'number',
    example: 2019,
    nullable: true,
  })
  combinedDate: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
  })
  productivity?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    nullable: true,
    description: 'Накопленная производительность',
  })
  accumulatedProductivity?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    nullable: false,
    description: 'Коэффициент затрат к производительности',
  })
  costToProductivityRatio: number;
}

export class ResponseInputDataForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto {
  @ApiPropertyOptional({
    type: 'number',
    example: 237,
    nullable: true,
  })
  machineId?: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 20,
    nullable: true,
  })
  markId?: number;

  @ApiProperty({
    type: 'string',
    example: 'EX1200-7',
  })
  markName: string;

  @ApiProperty({
    isArray: true,
    type: ObjectInputDataForForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto,
  })
  data: ObjectInputDataForForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto[];
}
