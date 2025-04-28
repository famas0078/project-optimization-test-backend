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

// таблица привязки стратегии машинам и наоборот (многие-ко-многим)
@Entity('machine2strategy')
@Unique('unique-machine2strategy', ['machine', 'strategy'])
export class Machine2Strategy extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // привязка к стратегии
  @ManyToOne(() => MroStrategy)
  @ApiProperty({ description: 'привязка к стратегии' })
  strategy: MroStrategy;

  // привязка к конкретной машине
  @ManyToOne(() => Machine)
  @ApiProperty({ description: 'привязка к конкретной машине' })
  machine: Machine;

  // примечание
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание' })
  notes: string;
}
