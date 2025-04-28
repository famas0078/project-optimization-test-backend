import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MachineClassesModule } from './machine-classes/machine-classes.module';
import { MachineTypesModule } from './machine-types/machine-types.module';
import { MachineMarksModule } from './machine-marks/machine-marks.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'data',
        module: DataModule,
        children: [
          {
            path: 'machine-classes',
            module: MachineClassesModule,
          },
          {
            path: 'machine-types',
            module: MachineTypesModule,
          },
          {
            path: 'machine-marks',
            module: MachineMarksModule,
          },
        ],
      },
    ]),
    MachineClassesModule,
    MachineTypesModule,
    MachineMarksModule,
  ],
})
export class DataModule {}
