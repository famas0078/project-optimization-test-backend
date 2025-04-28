import { Module } from '@nestjs/common';
import { MachineTypesService } from './machine-types.service';
import { MachineTypesController } from './machine-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineType } from 'src/db/entities/machine-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MachineType])],
  controllers: [MachineTypesController],
  providers: [MachineTypesService],
})
export class MachineTypesModule {}
