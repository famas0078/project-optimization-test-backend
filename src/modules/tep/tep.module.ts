import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TepController } from './tep.controller';
import { TepService } from './tep.service';
import { Face } from '../../db/entities/face.entity';
import { Machine2Face } from '../../db/entities/machine2face.entity';
import { WorkTimeProductivity } from '../../db/entities/work-time-productivity.entity';
import { Cost } from '../../db/entities/cost.entity';
import { MachinesModule } from '../machines/machines.module';
import { Machine } from '../../db/entities/machine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Face,
      Machine2Face,
      WorkTimeProductivity,
      Cost,
      Machine,
    ]),
    MachinesModule,
  ],
  controllers: [TepController],
  providers: [TepService],
})
export class TepModule {}
