import { Module } from '@nestjs/common';
import { MachineClassesService } from './machine-classes.service';
import { MachineClassesController } from './machine-classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineClass } from 'src/db/entities/machine-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MachineClass])],
  controllers: [MachineClassesController],
  providers: [MachineClassesService],
})
export class MachineClassesModule {}
