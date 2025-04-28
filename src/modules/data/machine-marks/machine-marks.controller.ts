import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MachineMarksService } from './machine-marks.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('machine-marks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MachineMarksController {
  constructor(private readonly machineMarksService: MachineMarksService) {}

  @ApiOperation({ summary: 'Get all machine marks' })
  @Get()
  findAll(
    @GetUser() user: any,
    @Query('classId', ParseIntPipe) classId: number,
  ) {
    return this.machineMarksService.findAll(user.organization.id, classId);
  }

  @ApiOperation({ summary: 'Get one machine mark by id' })
  @Get(':id')
  findOne(
    @GetUser() user: any,
    @Query('classId', ParseIntPipe) classId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.machineMarksService.findOne(+id, user.organization.id, classId);
  }
}
