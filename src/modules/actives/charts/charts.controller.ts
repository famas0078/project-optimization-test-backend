import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AverageMachineAge,
  ActivesChartsService,
  CumulativeMachineCount,
  MachineCountAndAverageAge,
  MachineWorkDistribution,
} from './charts.service';
import {
  RequestInputDataForGetAverageMachineAgeByYearDto,
  RequestInputDataForGetMachineCountAndAverageAgeByYearDto,
  RequestInputDataForGetMachineWorkDistributionDto,
  RequestInputDataForGetStructureChartDataDto,
} from './dto/charts.request.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/db/entities/user.entity';

@Controller()
@ApiTags('actives')
export class ActivesChartsController {
  constructor(private readonly activesChartsService: ActivesChartsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('structure')
  @ApiOperation({
    summary: 'Get structure chart data',
  })
  @ApiResponse({
    status: 200,
    description: 'Cumulative count of machines by year and category',
  })
  /**
   * Get the cumulative machine counts by year and category for structure chart.
   *
   * @param user - User object
   * @param query - Query parameters for filtering the data
   * @returns Cumulative machine counts by year and category
   */
  async getStructureChartData(
    @GetUser() user: User,
    @Query() query: RequestInputDataForGetStructureChartDataDto,
  ): Promise<CumulativeMachineCount[]> {
    // Call the filterMachines service method
    return await this.activesChartsService.getCumulativeMachineCountByYear(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      query.dateStart,
      query.dateEnd,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('average-age')
  @ApiOperation({
    summary: 'Get average age of machines by year',
  })
  @ApiResponse({
    status: 200,
    description: 'Average age of machines by year and category',
  })
  /**
   * Get the average age of machines by year and category.
   *
   * @param user - Request object
   * @param query - Query parameters for filtering the data
   * @returns Average age of machines by year and category
   */
  async getAverageMachineAgeByYear(
    @GetUser() user: User,
    @Query() query: RequestInputDataForGetAverageMachineAgeByYearDto,
  ): Promise<AverageMachineAge[]> {
    // Call the service method to get average age data
    return await this.activesChartsService.getAverageMachineAgeByYear(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      query.dateStart,
      query.dateEnd,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('count-and-average-age')
  @ApiOperation({
    summary: 'Get count and average age of machines by year',
  })
  @ApiResponse({
    status: 200,
    description: 'Count and average age of machines by year and category',
  })
  /**
   * Get the count and average age of machines by year and category.
   *
   * @param req - Request object
   * @param query - Query parameters for filtering the data
   * @returns Count and average age of machines by year and category
   */
  async getMachineCountAndAverageAgeByYear(
    @GetUser() user: User,
    @Query() query: RequestInputDataForGetMachineCountAndAverageAgeByYearDto,
  ): Promise<MachineCountAndAverageAge> {
    // Call the service method to get count and average age data
    return await this.activesChartsService.getMachineCountAndAverageAgeByYear(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      query.dateStart,
      query.dateEnd,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('work-distribution')
  @ApiOperation({
    summary: 'Get distribution of machine work types for the current year',
  })
  @ApiResponse({
    status: 200,
    description: 'Distribution of machine work types for the current year',
  })
  /**
   * Get the distribution of machine work types for the current year.
   *
   * @param req - Request object
   * @param query - Query parameters for filtering the data
   * @returns Distribution of machine work types for the current year
   */
  async getMachineWorkDistribution(
    @GetUser() user: User,
    @Query() query: RequestInputDataForGetMachineWorkDistributionDto,
  ): Promise<MachineWorkDistribution[]> {
    // Call the service method to get work distribution data
    return await this.activesChartsService.getMachineWorkDistribution(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      // query.dateStart,
      // query.dateEnd,
    );
  }
}
