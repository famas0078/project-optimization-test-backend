import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MachineClass } from '../entities/machine-class.entity';
import { DataSource, Repository, TreeRepository } from 'typeorm';

@Injectable()
export class MachineClassesSeedService {
  repo: TreeRepository<MachineClass>;

  constructor(
    // @InjectRepository(MachineClass)
    // private readonly repo: Repository<MachineClass>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getTreeRepository(MachineClass);
    this.seed().then();
  }

  async seed() {
    const records = this.repo.create([
      {
        id: 1,
        name: 'Все',
      },
      {
        id: 2,
        name: 'Основное оборудование',
        parent: {
          id: 1,
        },
      },
      {
        id: 3,
        name: 'Вспомогательное оборудование',
        parent: {
          id: 1,
        },
      },
      {
        id: 4,
        name: 'Экскаватор',
        parent: {
          id: 2,
        },
      },
      {
        id: 5,
        name: 'Самосвал',
        parent: {
          id: 2,
        },
      },
      {
        id: 6,
        name: 'Буровой станок',
        parent: {
          id: 2,
        },
      },
      {
        id: 7,
        name: 'Бульдозер',
        parent: {
          id: 3,
        },
      },
      {
        id: 8,
        name: 'Автогрейдер',
        parent: {
          id: 3,
        },
      },
      {
        id: 9,
        name: 'Погрузчик',
        parent: {
          id: 3,
        },
      },
      {
        id: 10,
        name: 'Дробильная установка',
        parent: {
          id: 3,
        },
      },
    ]);

    for (const record of records) {
      await record.save();
    }
  }
}
