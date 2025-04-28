import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../db/entities/user.entity';
import { Role } from '../../db/entities/role.entity';
import { Organization } from '../../db/entities/organization.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Organization]), MailModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
