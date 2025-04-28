import { Module } from '@nestjs/common';
import { MachinesModule } from '../machines/machines.module';
import { ActivesChartsModule } from './charts/charts.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'actives',
        children: [
          {
            path: 'machine-list',
            module: MachinesModule,
          },
          {
            path: 'charts',
            module: ActivesChartsModule,
          },
        ],
      },
    ]),
    MachinesModule,
    ActivesChartsModule,
  ],
})
export class ActivesModule {}
