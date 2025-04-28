import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineType } from 'src/db/entities/machine-type.entity';

@Injectable()
export class MachineTypesService {
  constructor(
    @InjectRepository(MachineType)
    private readonly machineTypesRepo: Repository<MachineType>,
  ) {}

  async findAll(organizationId: number): Promise<MachineType[]> {
    return await this.machineTypesRepo.find({
      where: {
        organization: {
          id: organizationId,
        },
      },
      relations: {
        machineClass: {
          parent: true,
        },
      },
    });
  }

  async findOne(id: number, organizationId: number): Promise<MachineType> {
    return await this.machineTypesRepo.findOneOrFail({
      where: {
        id,
        organization: {
          id: organizationId,
        },
      },
      relations: {
        machineClass: {
          parent: true,
        },
      },
    });
  }
}
