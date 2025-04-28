import { Module } from '@nestjs/common';
import { DataLoaderService } from './data-loader.service';
import { DataLoaderController } from './data-loader.controller';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'data-loader',
        module: DataLoaderModule,
      },
    ]),
  ],
  providers: [DataLoaderService],
  controllers: [DataLoaderController],
})
export class DataLoaderModule {}
