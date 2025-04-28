import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BreakdownType } from '../interfaces/tep.interface';
import { Type } from 'class-transformer';

export class RequestInputDataForVolumesDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsOptional(undefined)
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;

  @IsNotEmpty()
  @IsEnum(BreakdownType, { each: true })
  @ApiProperty({
    enum: BreakdownType,
    required: true,
    description: 'Указать одно из трех значений',
    example: [BreakdownType.year, BreakdownType.quarter, BreakdownType.month],
  })
  @IsString()
  breakdownType: BreakdownType;
}

export class RequestInputDataForParkProductivityDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;

  @IsNotEmpty()
  @IsEnum(BreakdownType, { each: true })
  @ApiProperty({
    enum: BreakdownType,
    required: true,
    description: 'Указать одно из трех значений',
    example: [BreakdownType.year, BreakdownType.quarter, BreakdownType.month],
  })
  @IsString()
  breakdownType: BreakdownType;
}

export class RequestInputDataForDynamicsOfUnitCostsDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;

  @IsNotEmpty()
  @IsEnum(BreakdownType, { each: true })
  @ApiProperty({
    enum: BreakdownType,
    required: true,
    description: 'Указать одно из трех значений',
    example: [BreakdownType.year, BreakdownType.quarter, BreakdownType.month],
  })
  @IsString()
  breakdownType: BreakdownType;
}

export class RequestInputDataForCostComparisonDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;
}

export class RequestInputDataForOwnershipCostStructureDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;
}

export class RequestInputDataForDynamicsOfUnitAccumulatedCostsDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;

  @IsNotEmpty()
  @IsEnum(BreakdownType, { each: true })
  @ApiProperty({
    enum: BreakdownType,
    required: true,
    description: 'Указать одно из трех значений',
    example: [BreakdownType.year, BreakdownType.quarter, BreakdownType.month],
  })
  @IsString()
  breakdownType: BreakdownType;
}

export class RequestInputDataForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto {
  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineClassIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineMarkIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineTypeIds: Array<number>;

  @Type(() => Number)
  @IsArray()
  @IsOptional(undefined)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    isArray: true,
    type: 'number',
    example: [1, 2, 3, 4, 5],
  })
  machineIds: Array<number>;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2024-03-07T11:39:48.791Z',
  })
  dateEnd: Date;

  @IsNotEmpty()
  @IsEnum(BreakdownType, { each: true })
  @ApiProperty({
    enum: BreakdownType,
    required: true,
    description: 'Указать одно из трех значений',
    example: [BreakdownType.year, BreakdownType.quarter, BreakdownType.month],
  })
  @IsString()
  breakdownType: BreakdownType;
}