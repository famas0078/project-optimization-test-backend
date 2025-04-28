/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/entities/user.entity';
import { Role } from '../../db/entities/role.entity';
import { Organization } from 'src/db/entities/organization.entity';
import { RegistrationAdministrationInterface } from './Interface/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async registrationAdministration(data: RegistrationAdministrationInterface) {
    try {
      const existingOrganization = await this.organizationRepository.findOneBy({
        id: data.organizationId,
      });

      if (!existingOrganization) {
        throw new HttpException(
          'Organization not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      const admin = this.userRepository.create();

      admin.role = await this.roleRepository.findOneBy({ name: 'Админ' });
      admin.email = data.email;
      admin.password = bcrypt.hashSync(data.password, 10);
      admin.organization = existingOrganization;
      admin.lastName = data.lastName;
      admin.firstName = data.firstName;
      admin.middleName = data.middleName;

      await this.userRepository.save(admin);

      this.logger.log('Регистрация админа прошла успешно');
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async validateUserCredentials(email: string, password: string) {
    const user = await User.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async giveToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(
        { ...payload, tokenType: 'access' },
        {
          expiresIn: '1d',
        },
      ),
      refresh_token: this.jwtService.sign(
        { ...payload, tokenType: 'refresh' },
        {
          expiresIn: '1w',
        },
      ),
    };
  }

  async giveMagicToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      tokenType: 'magic',
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
  }
}
