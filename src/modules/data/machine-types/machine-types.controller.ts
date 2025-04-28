import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MachineTypesService } from './machine-types.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/db/entities/user.entity';

@ApiTags('machine-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MachineTypesController {
  constructor(private readonly machineTypesService: MachineTypesService) {}

  @ApiOperation({ summary: 'Get all machine types' })
  @Get()
  findAll(@GetUser() user: User) {
    return this.machineTypesService.findAll(user.organization.id);
  }

  @ApiOperation({ summary: 'Get one machine type' })
  @Get(':id')
  findOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.machineTypesService.findOne(+id, user.organization.id);
  }
}
