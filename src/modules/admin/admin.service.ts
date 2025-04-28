import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entities/user.entity';
import { Role } from '../../db/entities/role.entity';
import { Organization } from '../../db/entities/organization.entity';
import {
  RegistrationOrganizationInterface,
  RegistrationUserInterface,
} from './interface/admin.interface';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private readonly mailService: MailService,
  ) {}

  async registrationOrganization(data: RegistrationOrganizationInterface) {
    try {
      const organization = this.organizationRepository.create();

      organization.name = data.name;
      organization.department = data.department;
      organization.notes = data.notes;

      await this.organizationRepository.save(organization);

      this.logger.log('Организация успешно зарегистрирована');
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async registrationUser(user: User, data: RegistrationUserInterface) {
    try {
      const newUser = this.userRepository.create();

      newUser.email = data.email;
      newUser.password = bcrypt.hashSync(data.password, 10);
      newUser.organization = user.organization;
      newUser.role = await this.roleRepository.findOneBy({ id: data.roleId });
      newUser.firstName = data.firstName;
      newUser.lastName = data.lastName;
      newUser.middleName = data.middleName;

      await this.userRepository.save(newUser);

      await this.mailService.sendNewDataUserRegister(
        data,
        newUser.organization.name,
      );
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async getRolesOperatorAndUser() {
    return await this.roleRepository.find({
      where: [{ name: 'Оператор' }, { name: 'Пользователь' }],
    });
  }

  async getOrganizations() {
    return await this.organizationRepository.find({
      select: {
        id: true,
        name: true,
        department: true,
      },
    });
  }

  async getDataCurrentUser(user: User) {
    return await this.userRepository.findOne({
      select: {
        id: true,
        role: {
          id: true,
          name: true,
        },
      },
      where: { id: user.id },
      relations: {
        role: true,
      },
    });
  }
}
