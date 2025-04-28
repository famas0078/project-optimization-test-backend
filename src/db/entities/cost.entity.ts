import { ApiProperty } from '@nestjs/swagger';
import { CostsKind } from 'src/db/entities/costs-kind.entity';
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

// таблица фактических и расчетных (модельных) затрат на эксплуатацию
@Entity()
@Unique('unique-cost', ['machine', 'kind', 'datePeriod', 'isModel'])
export class Cost extends BaseEntity {
  // идентификатор
  @ApiProperty({
    description: 'идентификатор',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // машина, для которой ведется журнал затрат
  @ApiProperty({
    description: 'машина, для которой ведется журнал затрат',
  })
  @ManyToOne(() => Machine)
  machine: Machine;

  // привязка к стратегии
  @ApiProperty({
    description: 'привязка к стратегии',
  })
  @ManyToOne(() => MroStrategy)
  strategy: MroStrategy;

  // тип хранимых данных (например, затраты на электроэнергию, топливо, ТО, ТР, ФОТ)
  @ApiProperty({
    description:
      'тип хранимых данных (например, затраты на электроэнергию, топливо, ТО, ТР, ФОТ)',
  })
  @ManyToOne(() => CostsKind)
  kind: CostsKind;

  // первый (вообще, любой) день месяца, в котором произведены затраты
  @ApiProperty({
    description:
      'первый (вообще, любой) день месяца, в котором произведены затраты',
  })
  @Column()
  datePeriod: Date;

  // величина понесенных затрат
  @ApiProperty({
    description: 'величина понесенных затрат',
  })
  @Column({
    type: 'float',
  })
  value: number;
  //TODO цена факт и план value_c
  // флаг, указывающий на расчетное значение величины value
  @ApiProperty({
    description: 'флаг, указывающий на расчетное значение величины value',
  })
  @Column({
    default: false,
    nullable: true,
  })
  isModel: boolean;
}
