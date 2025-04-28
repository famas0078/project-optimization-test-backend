import { ApiProperty } from '@nestjs/swagger';
import { Breakdown } from 'src/db/entities/breakdown.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// таблица видов отказов
@Entity()
export class Fault extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // наименование вида отказа узла/детали
  @Column()
  @ApiProperty({ description: 'наименование вида отказа узла/детали' })
  name: string;

  // описание вида отказа
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'описание вида отказа' })
  notes: string;

  // привязка к журналу отказов узлов и деталей машин
  @OneToMany(() => Breakdown, (breakdown: Breakdown) => breakdown.fault)
  @ApiProperty({
    description: 'привязка к журналу отказов узлов и деталей машин',
  })
  breakdowns: Breakdown[];
}
