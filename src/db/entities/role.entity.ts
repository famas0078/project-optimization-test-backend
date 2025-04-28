import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  SUPERADMIN = 1,
  ADMIN = 2,
  OPERATOR = 3,
  USER = 4,
}

@Entity()
export class Role extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'идентификатор',
  })
  id: number;

  // название роли
  @Column()
  @ApiProperty({
    description: 'название роли',
  })
  name: string;
}
