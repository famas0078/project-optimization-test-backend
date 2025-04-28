import { Module } from '@nestjs/common';
import { UsersSeedService } from './users.seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from 'src/db/entities/role.entity';
import { MachineClassesSeedService } from './machine-classes.seed.service';
import { MachineClass } from '../entities/machine-class.entity';
import { RolesSeedService } from './roles.seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, MachineClass])],
  providers: [RolesSeedService, UsersSeedService, MachineClassesSeedService],
})
export class SeedsModule {}
