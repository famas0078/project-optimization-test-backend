import { ApiProperty } from '@nestjs/swagger';
import { Machine } from 'src/db/entities/machine.entity';
import { MroStrategy } from 'src/db/entities/mro-strategy.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица фактических времени эксплуатации и производительности по каждой машине за каждый период
@Entity()
@Unique('unique-work-time-productivity', ['machine', 'datePeriod', 'isModel'])
export class WorkTimeProductivity extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // машина, для которой ведется журнал рабочего времени машины
  @ManyToOne(() => Machine, (machine) => machine.workTimeProductivity)
  @ApiProperty({
    description: 'машина, для которой ведется журнал рабочего времени машины',
  })
  machine: Machine;

  // привязка к стратегии
  @ManyToOne(() => MroStrategy)
  @ApiProperty({ description: 'привязка к стратегии' })
  strategy: MroStrategy;

  // первый (вообще, любой) день месяца, за который заносятся фактическое или расчетное рабочее время машины
  @Column()
  @ApiProperty({
    description:
      'первый (вообще, любой) день месяца, за который заносятся фактическое или расчетное рабочее время машины',
  })
  datePeriod: Date;

  // величина рабочего времени за период
  @Column({
    type: 'float',
  })
  @ApiProperty({ description: 'величина рабочего времени за период' })
  workTime: number;

  // величина производительности за период
  @Column({
    type: 'float',
    nullable: true,
  })
  @ApiProperty({ description: 'величина производительности за период' })
  productivity: number;

  // флаг, указывающий на расчетное значение величины value
  // true - Данные моделируются
  @Column({
    default: false,
    nullable: true,
  })
  @ApiProperty({
    description: 'флаг, указывающий на расчетное значение величины value',
  })
  isModel: boolean;
}
