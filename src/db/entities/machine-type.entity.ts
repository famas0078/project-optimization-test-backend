import { EmergencyDowntime } from 'src/db/entities/emergency-downtime.entity';
import { MachinePart } from 'src/db/entities/machine-part.entity';
import { Machine } from 'src/db/entities/machine.entity';
import { MRO } from 'src/db/entities/mro.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MachineClass } from './machine-class.entity';
import { ApiProperty } from '@nestjs/swagger';
import type { Organization } from './organization.entity';
import { MachineMark } from './machine-mark.entity';

// таблица моделей техники
@Entity()
@Unique('unique-machine-type', ['name', 'organization'])
export class MachineType extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // ссылка на организацию
  @ManyToOne('Organization')
  @ApiProperty({ description: 'ссылка на организацию' })
  organization: Organization;

  // ссылка на марку машины
  @ManyToOne(() => MachineMark)
  @ApiProperty({ description: 'ссылка на марку машины' })
  mark: MachineMark;

  // наименование марки машины
  @Column()
  @ApiProperty({ description: 'наименование марки машины' })
  name: string;

  // привязка к классу машины
  @ManyToOne(() => MachineClass)
  @ApiProperty({ description: 'привязка к классу машины' })
  machineClass: MachineClass;

  // тип двигателя
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'тип двигателя' })
  engine: string;

  // примечание
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание' })
  notes: string;

  // привязка к таблице техники предприятия
  @OneToMany(() => Machine, (machine: Machine) => machine.machineType)
  @ApiProperty({ description: 'привязка к таблице техники предприятия' })
  machines: Machine[];

  // привязка к журналу неплановых простоев
  @OneToMany(
    () => EmergencyDowntime,
    (emergencyDowntime: EmergencyDowntime) => emergencyDowntime.machineType,
  )
  @ApiProperty({
    description: 'привязка к журналу неплановых простоев',
  })
  emergencyDowntimes: EmergencyDowntime[];

  // привязка к деталям, принадлежащим марке
  @OneToMany(() => MachinePart, (part: MachinePart) => part.machineType)
  @ApiProperty({ description: 'привязка к деталям, принадлежащим марке' })
  parts: MachinePart[];

  // привязка к MRO
  @OneToMany(() => MRO, (mro: MRO) => mro.machineType)
  @ApiProperty({ description: 'привязка к MRO' })
  mro: MRO[];
}
