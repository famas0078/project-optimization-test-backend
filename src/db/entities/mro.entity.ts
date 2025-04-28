import { ApiProperty } from '@nestjs/swagger';
import { MachineType } from 'src/db/entities/machine-type.entity';
import { MroStrategy } from 'src/db/entities/mro-strategy.entity';
import { MroTimePrice } from 'src/db/entities/mro-time-price.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// перечисление видов ТОиР
export enum GroupMro {
  TM = 'ТО',
  TR = 'ТР',
  MR = 'КР',
  Tyres = 'Шины',
}

// таблица ТОиР (тип обслуживания согласно некоторой стратегии!)
@Entity()
@Unique('unique-mro-strategy-and-type', ['strategy', 'type'])
export class MRO extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // ссылка на стратегию ТОиР
  @ManyToOne(() => MroStrategy)
  @ApiProperty({ description: 'привязка к стратегии ТОиР' })
  strategy: MroStrategy;

  @ManyToOne(() => MachineType)
  @ApiProperty({ description: 'привязка к марке машины' })
  machineType: MachineType;

  // группа видов технического обслуживания ТО, ТР или КР
  @Column({
    type: 'enum',
    enum: GroupMro,
  })
  @ApiProperty({
    description: 'группа видов технического обслуживания ТО, ТР или КР',
  })
  group: GroupMro;

  // наименование вида ТОиР (ТР1, ТР2, ТО1, ТО2 и т.д., а также Шины и КР)
  @Column()
  @ApiProperty({ description: 'наименование вида ТОиР' })
  type: string;

  // через сколько маш.час проводится текущий вид ТОиР
  @Column()
  @ApiProperty({
    description: 'через сколько маш.час проводится текущий вид ТОиР',
  })
  serviceFrequency: number;

  // допустимый пробег шин (ходимость)
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'допустимый пробег шин (ходимость)' })
  walkingPath: number;

  // время проведения ТОиР или замены шин
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'время проведения ТОиР или замены шин' })
  operateTime: number;

  // "старшее" ТОиР, которое включается в текущее ТОиР (например, обычно в ТО3 включено ТО2, а в него ТО1, тогда для ТО3 это поле содержит ТО2, а для ТО2 - ТО1)
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description:
      '"старшее" ТОиР, которое включается в текущее ТОиР (например, обычно в ТО3 включено ТО2, а в него ТО1, тогда для ТО3 это поле содержит ТО2, а для ТО2 - ТО1)',
  })
  includeMRO: string;

  // массив видов ТОиР, в которые включено текущее ТОиР
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @ApiProperty({
    description: 'массив видов ТОиР, в которые включено текущее ТОиР',
  })
  whereExecuted: string[];

  // примечание
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание' })
  notes: string;

  @OneToMany(() => MroTimePrice, (timePrice: MroTimePrice) => timePrice.mro)
  @ApiProperty({ description: 'привязка к журналу цен на ТОиР' })
  MroTimePrices: MroTimePrice[];
}
