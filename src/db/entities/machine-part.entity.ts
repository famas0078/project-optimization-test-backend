import { ApiProperty } from '@nestjs/swagger';
import { Breakdown } from 'src/db/entities/breakdown.entity';
import { MachineType } from 'src/db/entities/machine-type.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица конструкций машин
@Entity()
@Unique('unique-machine-part', ['machineType', 'subAssembly', 'part'])
export class MachinePart extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // привязка к марке машины
  @ManyToOne(() => MachineType)
  @ApiProperty({ description: 'привязка к марке машины' })
  machineType: MachineType;

  // подсистема машины
  @Column()
  @ApiProperty({ description: 'подсистема машины' })
  subAssembly: string;

  // деталь, узел машины (область интересов при фиксации неисправностей и отказов)
  @Column()
  @ApiProperty({ description: 'деталь, узел машины' })
  part: string;

  // примечание, описание узла
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание, описание узла' })
  notes: string;

  // привязка к журналу отказов узлов и деталей машин
  @OneToMany(() => Breakdown, (breakdown: Breakdown) => breakdown.part)
  @ApiProperty({
    description: 'привязка к журналу отказов узлов и деталей машин',
  })
  breakdowns: Breakdown[];
}
