import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { MachineType } from './machine-type.entity';

@Entity()
@Tree('materialized-path')
export class MachineClass extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // наименование
  @Column()
  @ApiProperty({ description: 'наименование' })
  name: string;

  // привязка к таблице марок техники
  @OneToMany(() => MachineType, (record) => record.machineClass)
  @ApiProperty({ description: 'привязка к таблице марок техники' })
  machineTypes: MachineType[];

  // родительский класс
  @TreeParent()
  @ApiProperty({ description: 'родительский класс' })
  parent: MachineClass;

  // дочерний класс
  @TreeChildren()
  @ApiProperty({ description: 'дочерний класс' })
  children: MachineClass[];
}
