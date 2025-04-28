import { ApiProperty } from '@nestjs/swagger';
import { Machine } from 'src/db/entities/machine.entity';
import { MroStrategy } from 'src/db/entities/mro-strategy.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица корректировки стоимости ТОиР и аварий
@Entity()
@Unique('unique-adjusted-cost-mro', ['machine', 'datePeriod'])
export class AdjustedCostMro {
  // идентификатор
  @ApiProperty({ description: 'идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  // привязка к конкретной машине
  @ApiProperty({ description: 'привязка к конкретной машине' })
  @ManyToOne(() => Machine)
  machine: Machine;

  // привязка к стратегии ТОиР
  @ApiProperty({ description: 'привязка к стратегии ТОиР' })
  @ManyToOne(() => MroStrategy)
  strategy: MroStrategy;

  // период, для которой корректируются затраты на ТОиР и устранение аварии
  @ApiProperty({
    description:
      'период, для которой корректируются затраты на ТОиР и устранение аварии',
  })
  @Column()
  datePeriod: Date;

  // значение затрат, которые будут прибавлены (или вычтены, если они отрицательны) из общих эксплуатационных затрат на машину
  @ApiProperty({
    description:
      'значение затрат, которые будут прибавлены (или вычтены, если они отрицательны) из общих эксплуатационных затрат на машину',
  })
  @Column()
  value: number;
}
