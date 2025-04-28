import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/db/entities/role.entity';
import { User } from 'src/db/entities/user.entity';
import {
  ApiTags,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RequestRegistrationAdministrationDto } from './dto/auth.request.dto';
import { ResponseOnBadRequestOrganization } from './dto/auth.response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary:
      'Get tokens by email and password. Returns access and refresh tokens',
  })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
    examples: {
      login: {
        summary: 'Example of a login request',
        value: {
          username: 'user@example.com',
          password: 'example',
        },
      },
    },
  })
  /**
   * Handles user login and returns access and refresh tokens.
   *
   * This method is protected by the LocalAuthGuard and is called
   * when a POST request is made to the 'login' endpoint. It generates
   * and returns JWT tokens for authenticated users.
   *
   * @param req - The request object containing user information.
   * @returns A promise that resolves to an object containing access and refresh tokens.
   */
  async login(
    @Req() req: Request,
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    // Generate and return JWT tokens for the authenticated user
    return await this.authService.giveToken(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Get tokens by refresh token. Returns access and refresh tokens',
  })
  @ApiOkResponse({ description: 'Refresh successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  /**
   * Handles refresh token and returns new access and refresh tokens.
   *
   * This method is protected by the JwtRefreshGuard and is called
   * when a POST request is made to the 'refresh' endpoint. It generates
   * and returns new JWT tokens for authenticated users.
   *
   * @param req - The request object containing user information.
   * @returns A promise that resolves to an object containing new access and refresh tokens.
   */
  async refresh(@Req() req: Request) {
    // Generate and return new JWT tokens for the authenticated user
    return this.authService.giveToken(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Регистрация. Регистрация администратора. Выбирает организацию при регистрации',
  })
  @ApiBadRequestResponse({
    description: 'Код организации не верный',
    type: ResponseOnBadRequestOrganization,
  })
  @Post('registration/administration')
  async registrationNewAdministration(
    @Body() data: RequestRegistrationAdministrationDto,
  ) {
    await this.authService.registrationAdministration(data);
  }
}
