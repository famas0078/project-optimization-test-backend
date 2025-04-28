import { ApiProperty } from '@nestjs/swagger';
import { Breakdown } from 'src/db/entities/breakdown.entity';
import { Face } from 'src/db/entities/face.entity';
import type { Machine } from 'src/db/entities/machine.entity';
import { MinePlan } from 'src/db/entities/mine-plan.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { MachineType } from './machine-type.entity';

// таблица с организациями и подразделениями для раздельного учета и моделирования парка машин
@Entity()
@Unique('unique-organization-name-and-department', ['name', 'department'])
export class Organization extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // наименование предприятия
  @Column()
  @ApiProperty({ description: 'наименование предприятия' })
  name: string;

  // наименование подразделения в организации для отдельного учёта и моделирования парка машин
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'наименование подразделения' })
  department: string;

  // примечание
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание' })
  notes: string;

  // подразделения (забои) горного предприятия
  @OneToMany('Face', (face: Face) => face.organization)
  @ApiProperty({ description: 'подразделения (забои) горного предприятия' })
  faces: Face[];

  // машины предприятия
  @OneToMany('Machine', (machine: Machine) => machine.organization)
  @ApiProperty({ description: 'машины предприятия' })
  machines: Machine[];

  // отказы узлов и деталей машин на предприятии
  @OneToMany(() => Breakdown, (breakdown: Breakdown) => breakdown.organization)
  @ApiProperty({ description: 'отказы узлов и деталей машин на предприятии' })
  breakdowns: Breakdown[];

  // планы развития горных работ на предприятии на будущие периоды
  @OneToMany(() => MinePlan, (plan: MinePlan) => plan.organization)
  @ApiProperty({
    description:
      'планы развития горных работ на предприятии на будущие периоды',
  })
  minePlans: MinePlan[];

  // марки машин предприятия
  @OneToMany(
    'MachineType',
    (machineType: MachineType) => machineType.organization,
  )
  @ApiProperty({ description: 'марки машин предприятия' })
  machineTypes: MachineType[];
}
