import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MachineType } from './machine-type.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MachineMark extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  // идентификатор
  id: number;

  @Column()
  @ApiProperty({ description: 'наименование марки машины' })
  // наименование марки машины
  name: string;

  @OneToMany(() => MachineType, (machineType: MachineType) => machineType.mark)
  @ApiProperty({ description: 'список моделей машин' })
  // список моделей машин
  models: MachineType[];
}
