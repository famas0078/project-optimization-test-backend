import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CtfChartsModule } from './charts/charts.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/ctf',
        module: CtfModule,
        children: [
          {
            path: '/charts',
            module: CtfChartsModule,
          },
        ],
      },
    ]),
    CtfChartsModule,
  ],
})
export class CtfModule {}
