import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/db/entities/role.entity';
import { Roles } from 'src/db/entities/role.entity';

@Injectable()
export class UsersSeedService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    this.seed().then();
  }

  async seed() {
    const users = this.repo.create([
      {
        id: 1,
        email: 'root@server.local',
        password: await bcrypt.hash('whoami', 10),
        role: await Role.findOneBy({
          id: Roles.SUPERADMIN,
        }),
      },
    ]);

    for (const user of users) {
      await user.save();
    }
  }
}
