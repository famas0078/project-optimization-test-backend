import { ApiProperty } from '@nestjs/swagger';
import { Face } from 'src/db/entities/face.entity';
import { Machine } from 'src/db/entities/machine.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица приписки машины к забою и ее характеристики
@Entity('machine2face')
@Unique('unique_machine2face', ['face', 'machine', 'dateChange'])
export class Machine2Face extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // привязка к забою
  @ManyToOne(() => Face)
  @ApiProperty({ description: 'привязка к забою' })
  face: Face;

  // привязка к машине
  @OneToOne('Machine', (machine: Machine) => machine.machine2face)
  @JoinColumn()
  @ApiProperty({ description: 'привязка к машине' })
  machine: Machine;

  // дата (первый день месяца) изменения "прикрепления" машнины к забою
  @Column()
  @ApiProperty({
    description:
      'дата (первый день месяца) изменения "прикрепления" машнины к забою',
  })
  dateChange: Date;

  // техническая производительность машины в текущем забое
  @Column({
    nullable: true,
    type: 'float',
  })
  @ApiProperty({
    description: 'техническая производительность машины в текущем забое',
  })
  machinePerformance: number;

  // средний расход топлива или электроэнергии за 1 маш.час в текущем забое
  @Column({
    nullable: true,
    type: 'float',
  })
  @ApiProperty({
    description:
      'средний расход топлива или электроэнергии за 1 маш.час в текущем забое',
  })
  fuelConsumption: number;

  // средняя скорость движения машины в текущем забое (для преобразования ходимости шин из км в маш.час)
  @Column({
    nullable: true,
    type: 'float',
    default: 1,
  })
  @ApiProperty({
    description:
      'средняя скорость движения машины в текущем забое (для преобразования ходимости шин из км в маш.час)',
  })
  averageSpeed: number;

  // примечание
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание' })
  notes: string;
}
