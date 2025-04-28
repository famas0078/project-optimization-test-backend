import { Injectable } from '@nestjs/common';
import { Role, Roles as RolesEnum } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesSeedService {
  constructor(@InjectRepository(Role) private readonly repo: Repository<Role>) {
    this.seed().then();
  }

  async seed() {
    const roles = this.repo.create([
      {
        id: RolesEnum.SUPERADMIN,
        name: 'Суперадмин',
      },
      {
        id: RolesEnum.ADMIN,
        name: 'Админ',
      },
      {
        id: RolesEnum.OPERATOR,
        name: 'Оператор',
      },
      {
        id: RolesEnum.USER,
        name: 'Пользователь',
      },
    ]);

    for (const role of roles) {
      await role.save();
    }
  }
}
