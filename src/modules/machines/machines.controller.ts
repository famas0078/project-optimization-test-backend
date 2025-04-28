import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/db/entities/role.entity';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Machine } from 'src/db/entities/machine.entity';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/db/entities/user.entity';
import { RequestInputDataForGetMachineListDTO } from './dto/machines.dto';

@ApiTags('machines')
@Controller('')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard(Roles.ADMIN, Roles.OPERATOR, Roles.USER))
  @Get()
  @ApiOperation({
    summary:
      'Get the list of machines by organization, machine class, and machine type',
  })
  @ApiOkResponse({
    description: 'A list of machines',
    type: Machine,
    isArray: true,
  })
  /**
   * Get the list of machines by organization, machine class, and machine type.
   *
   * @param user - User object from the request
   * @param query - Query object from the request
   * @returns A promise resolving to a list of machines
   */
  async getMachineList(
    @GetUser() user: User,
    @Query() query: RequestInputDataForGetMachineListDTO,
  ): Promise<Machine[]> {
    // Call the filterMachines method from the service to retrieve the list of machines
    return await this.machinesService.filterMachines(
      user.organization.id,
      query.machineClassIds,
      query.machineMarkIds,
      query.machineTypeIds,
      query.machineIds,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard(Roles.ADMIN, Roles.OPERATOR, Roles.USER))
  @Get('earliest-entry-date')
  @ApiOperation({
    summary:
      "Get the earliest machine's entry date by organization, machine class, and machine type",
  })
  @ApiOkResponse({
    description: 'A date of the earliest machine entry',
    type: Date,
    isArray: true,
  })
  /**
   * Get the earliest machine's entry date by organization, machine class, and machine type.
   *
   * @param user - User object from the request
   * @param query - Query object from the request
   * @returns A promise resolving to a list of machines
   */
  async findEarliestMachineEntryDate(
    @GetUser() user: User,
    @Query() query: RequestInputDataForGetMachineListDTO,
  ): Promise<Date> {
    // Call the filterMachines method from the service to retrieve the list of machines
    const earliestDate =
      await this.machinesService.findEarliestMachineEntryDate(
        user.organization.id,
        query.machineClassIds,
        query.machineMarkIds,
        query.machineTypeIds,
        query.machineIds,
      );
    return earliestDate;
  }
}
