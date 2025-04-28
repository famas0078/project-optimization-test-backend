import { Injectable, NotFoundException } from '@nestjs/common';
import { MachineMark } from 'src/db/entities/machine-mark.entity';

@Injectable()
export class MachineMarksService {
  async findAll(organizationId: number, classId: number) {
    return await MachineMark.find({
      where: {
        models: {
          organization: {
            id: organizationId,
          },
          machineClass: {
            id: classId,
          },
        },
      },
      relations: {
        models: {
          organization: true,
          machines: true,
          machineClass: true,
        },
      },
    });
  }

  async findOne(id: number, organizationId: number, classId: number) {
    const mark = await MachineMark.findOne({
      where: {
        id,
        models: {
          organization: {
            id: organizationId,
          },
          machineClass: {
            id: classId,
          },
        },
      },
      relations: {
        models: {
          organization: true,
          machines: true,
          machineClass: true,
        },
      },
    });
    if (!mark) {
      throw new NotFoundException(`MachineMark with ID ${id} not found`);
    }
    return mark;
  }
}
