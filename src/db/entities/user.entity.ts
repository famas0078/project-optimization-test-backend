import { Role } from 'src/db/entities/role.entity';
import { Organization } from 'src/db/entities/organization.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  @Column({ comment: 'Имя', unique: false, nullable: true })
  firstName: string;

  @Column({ comment: 'Фамилия', unique: false, nullable: true })
  lastName: string;

  @Column({ comment: 'Отчество', unique: false, nullable: true })
  middleName: string;

  // электронная почта
  @Column()
  @ApiProperty({ description: 'электронная почта' })
  email: string;

  // пароль
  @Column()
  @ApiProperty({ description: 'пароль' })
  password: string;

  // организация
  @ManyToOne(() => Organization)
  @ApiProperty({ description: 'привязка к организации' })
  organization: Organization;

  // роль
  @ManyToOne(() => Role)
  @ApiProperty({ description: 'привязка к роли' })
  role: Role;
}
