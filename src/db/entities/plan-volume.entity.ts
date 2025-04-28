import { ApiProperty } from '@nestjs/swagger';
import { MinePlan } from 'src/db/entities/mine-plan.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица объемов работ для плана горных работ на будущие периоды
@Entity()
@Unique('unique-plan-volumes', ['minePlan', 'zoneWorking', 'machineType'])
export class PlanVolume {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // привязка к плану горных работ
  @ManyToOne(() => MinePlan)
  @ApiProperty({ description: 'привязка к плану горных работ' })
  minePlan: MinePlan;

  // зона работы
  @Column()
  @ApiProperty({ description: 'зона работы' })
  zoneWorking: string;

  // тип машин
  @Column()
  @ApiProperty({ description: 'тип машин' })
  machineType: string;

  // значение добычи или вскрыши (зоны работ)
  @Column()
  @ApiProperty({ description: 'значение добычи или вскрыши (зоны работ)' })
  value: number;
}
