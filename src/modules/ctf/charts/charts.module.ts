import { Module } from '@nestjs/common';
import { CtfChartsService } from './charts.service';
import { CtfChartsController } from './charts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CTFRecord } from 'src/db/entities/ctf-records.entity';
import { MachinesModule } from 'src/modules/machines/machines.module';

@Module({
  imports: [TypeOrmModule.forFeature([CTFRecord]), MachinesModule],
  providers: [CtfChartsService],
  controllers: [CtfChartsController],
})
export class CtfChartsModule {}
