import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Organization } from '../../db/entities/organization.entity';
import { Role } from '../../db/entities/role.entity';
import { User } from '../../db/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Organization]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        privateKey: (
          await fs.readFile(
            path.resolve(process.cwd(), 'config/keys/jwtKey.pem'),
          )
        ).toString(),
        publicKey: (
          await fs.readFile(
            path.resolve(process.cwd(), 'config/keys/jwtKey.pub.pem'),
          )
        ).toString(),
        signOptions: {
          algorithm: 'RS256',
        },
        global: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, JwtRefreshStrategy, LocalStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
