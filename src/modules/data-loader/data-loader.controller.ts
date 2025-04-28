import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DataLoaderService } from './data-loader.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller()
export class DataLoaderController {
  constructor(private readonly dataLoaderService: DataLoaderService) {}

  @Post('load-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'techSpec',
        maxCount: 1,
      },
      {
        name: 'workTimeProductivity',
        maxCount: 1,
      },
      {
        name: 'costs',
        maxCount: 1,
      },
      {
        name: 'breakdowns',
        maxCount: 1,
      },
    ]),
  )
  async loadAllData(
    @UploadedFiles()
    files: {
      techSpec: Express.Multer.File[];
      workTimeProductivity: Express.Multer.File[];
      costs: Express.Multer.File[];
      breakdowns: Express.Multer.File[];
    },
  ) {
    return this.dataLoaderService.loadAllData(
      files.techSpec[0],
      files.workTimeProductivity[0],
      files.costs[0],
      files.breakdowns[0],
    );
  }

  @Post('load-tech-spec')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'techSpec',
        maxCount: 1,
      },
    ]),
  )
  async loadTechSpecDataOnly(
    @UploadedFiles()
    files: {
      techSpec: Express.Multer.File[];
    },
  ) {
    return this.dataLoaderService.loadTechSpecData(files.techSpec[0]);
  }

  @Post('load-work-time-productivity')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'workTimeProductivity',
        maxCount: 1,
      },
    ]),
  )
  async loadWorkTimeProductivityData(
    @UploadedFiles()
    files: {
      workTimeProductivity: Express.Multer.File[];
    },
  ) {
    return this.dataLoaderService.loadWorkTimeProductivityData(
      files.workTimeProductivity[0],
    );
  }

  @Post('load-costs')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'costs',
        maxCount: 1,
      },
    ]),
  )
  async loadCostsData(
    @UploadedFiles()
    files: {
      costs: Express.Multer.File[];
    },
  ) {
    return this.dataLoaderService.loadCostsData(files.costs[0]);
  }

  @Post('load-breakdowns')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'breakdowns',
        maxCount: 1,
      },
    ]),
  )
  async loadBreakdownsData(
    @UploadedFiles()
    files: {
      breakdowns: Express.Multer.File[];
    },
  ) {
    return this.dataLoaderService.loadBreakdownsData(files.breakdowns[0]);
  }
}
