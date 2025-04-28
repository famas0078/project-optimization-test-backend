import { ApiProperty } from '@nestjs/swagger';
import { Face } from 'src/db/entities/face.entity';
import { MachineType } from 'src/db/entities/machine-type.entity';
import { MroStrategy } from 'src/db/entities/mro-strategy.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица неплановых простоев (аварий), зависящих от марки машины и ее возраста
@Entity()
@Unique('unique-emergency-downtime', [
  'face',
  'strategy',
  'machineType',
  'dateChange',
  'yearsAction',
])
export class EmergencyDowntime extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'идентификатор',
  })
  id: number;

  // ссылка на забой где работает машина (и опосредованно ссылка на организацию/департамент)
  @ManyToOne(() => Face)
  @ApiProperty({
    description:
      'ссылка на забой где работает машина (и опосредованно ссылка на организацию/департамент)',
  })
  face: Face;

  // привязка к стратегии ТОиР
  @ManyToOne(() => MroStrategy)
  @ApiProperty({
    description: 'привязка к стратегии ТОиР',
  })
  strategy: MroStrategy;

  // марка машины, для которой вводится коэффициент возможных аварий
  @ManyToOne(() => MachineType)
  @ApiProperty({
    description:
      'марка машины, для которой вводится коэффициент возможных аварий',
  })
  machineType: MachineType;

  // начало периода действия всего набора коэффициентов, зависящих от возраста машин одной марки
  @Column()
  @ApiProperty({
    description:
      'начало периода действия всего набора коэффициентов, зависящих от возраста машин одной марки',
  })
  dateChange: Date;

  // количество лет применения текущего коээфициента
  @Column()
  @ApiProperty({
    description: 'количество лет применения текущего коээфициента',
  })
  yearsAction: Date;

  // коэффициент неплановых (аварийных) простоев
  @Column()
  @ApiProperty({
    description: 'коэффициент неплановых (аварийных) простоев',
  })
  factorEmergency: number;
}
