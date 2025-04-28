import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for requesting structure chart data.
 */
export class RequestInputDataForGetStructureChartDataDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to start searching from',
  })
  /**
   * Date to start searching from.
   * @type {Date}
   */
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to search up to',
  })
  /**
   * Date to search up to.
   * @type {Date}
   */
  dateEnd: Date;

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array of machine class IDs',
  })
  /**
   * Array of machine class IDs.
   * @type {number[]}
   * @default [1]
   */
  machineClassIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine mark IDs',
  })
  /**
   * Array of machine mark IDs.
   * @type {number[]}
   * @default []
   */
  machineMarkIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine type IDs',
  })
  /**
   * Array of machine type IDs.
   * @type {number[]}
   * @default []
   */
  machineTypeIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine IDs',
  })
  /**
   * Array of machine IDs.
   * @type {number[]}
   * @default []
   */
  machineIds?: number[];
}

/**
 * Data Transfer Object for requesting average machine age by year chart data.
 */
export class RequestInputDataForGetAverageMachineAgeByYearDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to start searching from',
  })
  /**
   * Date to start searching from.
   * @type {Date}
   */
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to search up to',
  })
  /**
   * Date to search up to.
   * @type {Date}
   */
  dateEnd: Date;

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array of machine class IDs',
  })
  /**
   * Array of machine class IDs.
   * @type {number[]}
   * @default [1]
   */
  machineClassIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine mark IDs',
  })
  /**
   * Array of machine mark IDs.
   * @type {number[]}
   * @default []
   */
  machineMarkIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine type IDs',
  })
  /**
   * Array of machine type IDs.
   * @type {number[]}
   * @default []
   */
  machineTypeIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine IDs',
  })
  /**
   * Array of machine IDs.
   * @type {number[]}
   * @default []
   */
  machineIds?: number[];
}

/**
 * Data Transfer Object for requesting average machine age by year chart data.
 */
export class RequestInputDataForGetMachineCountAndAverageAgeByYearDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to start searching from',
  })
  /**
   * Date to start searching from.
   * @type {Date}
   */
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to search up to',
  })
  /**
   * Date to search up to.
   * @type {Date}
   */
  dateEnd: Date;

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array of machine class IDs',
  })
  /**
   * Array of machine class IDs.
   * @type {number[]}
   * @default [1]
   */
  machineClassIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine mark IDs',
  })
  /**
   * Array of machine mark IDs.
   * @type {number[]}
   * @default []
   */
  machineMarkIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine type IDs',
  })
  /**
   * Array of machine type IDs.
   * @type {number[]}
   * @default []
   */
  machineTypeIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine IDs',
  })
  /**
   * Array of machine IDs.
   * @type {number[]}
   * @default []
   */
  machineIds?: number[];
}

/**
 * Data Transfer Object for requesting average machine age by year chart data.
 */
export class RequestInputDataForGetMachineWorkDistributionDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to start searching from',
  })
  /**
   * Date to start searching from.
   * @type {Date}
   */
  dateStart: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: true,
    description: 'Date to search up to',
  })
  /**
   * Date to search up to.
   * @type {Date}
   */
  dateEnd: Date;

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array of machine class IDs',
  })
  /**
   * Array of machine class IDs.
   * @type {number[]}
   * @default [1]
   */
  machineClassIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine mark IDs',
  })
  /**
   * Array of machine mark IDs.
   * @type {number[]}
   * @default []
   */
  machineMarkIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine type IDs',
  })
  /**
   * Array of machine type IDs.
   * @type {number[]}
   * @default []
   */
  machineTypeIds?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'Array of machine IDs',
  })
  /**
   * Array of machine IDs.
   * @type {number[]}
   * @default []
   */
  machineIds?: number[];
}
