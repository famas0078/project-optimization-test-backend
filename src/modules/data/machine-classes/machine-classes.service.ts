import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MachineClass } from 'src/db/entities/machine-class.entity';
import { DataSource, TreeRepository } from 'typeorm';

@Injectable()
export class MachineClassesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.machineClassesRepo = this.dataSource.getTreeRepository(MachineClass);
  }

  machineClassesRepo: TreeRepository<MachineClass>;

  async findAll(): Promise<MachineClass[]> {
    return await this.machineClassesRepo.findTrees();
  }

  async findOne(id: number, organizationId: number): Promise<MachineClass> {
    const machineClass = await this.machineClassesRepo.findOne({
      where: {
        id,
        machineTypes: {
          organization: {
            id: organizationId,
          },
        },
      },
      relations: {
        parent: true,
        children: {
          children: {
            children: {
              machineTypes: {
                mark: true,
                machineClass: true,
              },
            },
            machineTypes: {
              mark: true,
              machineClass: true,
            },
          },
          machineTypes: {
            mark: true,
            machines: true,
          },
        },

        machineTypes: {
          mark: true,
          machines: true,
        },
      },
    });
    if (!machineClass) {
      throw new NotFoundException(`MachineClass with ID ${id} not found`);
    }
    return machineClass;
  }
}
