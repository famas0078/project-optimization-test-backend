import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RequestRegistrationAdministrationDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'example@test.com',
  })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Не верный email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  organizationId: number;

  @ApiPropertyOptional()
  @IsOptional(undefined)
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional(undefined)
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional(undefined)
  @IsString()
  middleName?: string;
}

export class RequestRegistrationOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional(undefined)
  @IsString()
  department: string;

  @ApiPropertyOptional()
  @IsOptional(undefined)
  @IsString()
  notes: string;
}

export class RequestRegistrationUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'example@test.com',
  })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Не верный email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  roleId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  middleName: string;
}
