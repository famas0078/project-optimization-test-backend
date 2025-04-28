import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../db/entities/role.entity';
import {
  ResponseGetDataCurrentUserDto,
  ResponseGetOrganizationsDto,
  ResponseGetRolesDto,
} from './dto/admin.response.dto';
import { GetUser } from '../../common/decorators/user.decorator';
import { User } from '../../db/entities/user.entity';
import {
  RequestRegistrationOrganizationDto,
  RequestRegistrationUserDto,
} from '../auth/dto/auth.request.dto';

@ApiTags('Administration')
@Controller('administration')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({
    summary: 'Получить список организаций',
  })
  @ApiOkResponse({
    description: 'Список организаций',
    type: [ResponseGetOrganizationsDto],
  })
  @Get('organizations')
  async getOrganizations() {
    return await this.adminService.getOrganizations();
  }

  @ApiOperation({
    summary:
      'Аутентификация. Администратор. Получение роли оператор и пользователь',
  })
  @ApiOkResponse({
    description: 'Роли оператор и пользователь',
    type: [ResponseGetRolesDto],
  })
  @UseGuards(JwtAuthGuard /*RolesGuard(Roles.ADMIN)*/)
  @Get('roles')
  async getRolesOperatorAndUser() {
    return await this.adminService.getRolesOperatorAndUser();
  }

  @ApiOperation({
    summary: 'Аутентификация. Получение данных профиля',
  })
  @ApiOkResponse({
    description: 'Объект данных пользователя',
    type: ResponseGetDataCurrentUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getDataCurrentUser(@GetUser() user: User) {
    return await this.adminService.getDataCurrentUser(user);
  }

  @ApiOperation({
    summary: 'Аутентификация. Супер Админ. Регистрация новых организаций',
  })
  @UseGuards(JwtAuthGuard, RolesGuard(Roles.SUPERADMIN))
  @Post('registration/organizations')
  async registrationOrganization(
    @Body() data: RequestRegistrationOrganizationDto,
  ) {
    await this.adminService.registrationOrganization(data);
  }

  @ApiOperation({
    summary:
      'Аутентификация. Администратор. Регистрация новых пользователей с отправкой данный на почту',
  })
  @UseGuards(JwtAuthGuard, RolesGuard(Roles.ADMIN))
  @Post('registration/users')
  async registrationUsers(
    @GetUser() user: User,
    @Body() data: RequestRegistrationUserDto,
  ) {
    await this.adminService.registrationUser(user, data);
  }
}
