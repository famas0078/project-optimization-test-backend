import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MachineClassesService } from './machine-classes.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';

@ApiTags('machine-classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MachineClassesController {
  constructor(private readonly machineClassesService: MachineClassesService) {}

  @ApiOperation({ summary: 'Get all machine classes' })
  @Get()
  findAll() {
    return this.machineClassesService.findAll();
  }

  @ApiOperation({ summary: 'Get one machine class by id' })
  @Get(':id')
  findOne(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.machineClassesService.findOne(+id, user.organization.id);
  }
}
