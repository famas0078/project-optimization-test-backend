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

// таблица корректировки времени работы машины на ТОиР и аварий
@Entity()
@Unique('unique-adjusted-time-mro', ['machine', 'datePeriod'])
export class AdjustedTimeMro {
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

  // период, для которого корректируется время ТОиР и аварий
  @ApiProperty({
    description: 'период, для которого корректируется время ТОиР и аварий',
  })
  @Column()
  datePeriod: Date;

  // значение времени, которое будет вычтено (или прибавлено, если оно отрицательно) из времени работы машины
  @ApiProperty({
    description:
      'значение времени, которое будет вычтено (или прибавлено, если оно отрицательно) из времени работы машины',
  })
  @Column()
  value: number;
}
