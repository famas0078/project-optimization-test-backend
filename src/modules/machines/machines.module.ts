import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from 'src/db/entities/machine.entity';
import { MachineClass } from 'src/db/entities/machine-class.entity';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Machine, MachineClass]),
    RouterModule.register([
      {
        module: MachinesModule,
        path: 'machines',
      },
    ]),
  ],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService],
})
export class MachinesModule {}
