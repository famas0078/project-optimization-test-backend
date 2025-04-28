import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CtfChartsService } from './charts.service';
import { Roles } from 'src/db/entities/role.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  RequestInputDataForGetCtfStructureDataDto,
  RequestInputDataForGetCtfWorktimeByServiceLifeDataDto,
  RequestInputDataForGetCtfYearlyDataDto,
} from './dto/charts.request.dto';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller()
@ApiBearerAuth()
export class CtfChartsController {
  constructor(private readonly ctfChartsService: CtfChartsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard(Roles.USER))
  @Get('structure')
  async getCtfStructureData(
    @GetUser() user: any,
    @Query() query: RequestInputDataForGetCtfStructureDataDto,
  ) {
    return await this.ctfChartsService.getCtfStructureData(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      query.dateStart,
      query.dateEnd,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Roles.USER))
  @Get('yearly')
  async getCtfDataByYear(
    @GetUser() user: any,
    @Query() query: RequestInputDataForGetCtfYearlyDataDto,
  ) {
    return await this.ctfChartsService.getCtfDataByYear(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      query.dateStart,
      query.dateEnd,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Roles.USER))
  @Get('worktimeByServiceLife')
  async getWorktimeByServiceLife(
    @GetUser() user: any,
    @Query() query: RequestInputDataForGetCtfWorktimeByServiceLifeDataDto,
  ) {
    return await this.ctfChartsService.getCtfWorktimeByServiceLife(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
      query.dateStart,
      query.dateEnd,
    );
  }
}
