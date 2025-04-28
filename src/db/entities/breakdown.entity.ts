import { ApiProperty } from '@nestjs/swagger';
import { Fault } from 'src/db/entities/fault.entity';
import { MachinePart } from 'src/db/entities/machine-part.entity';
import { Machine } from 'src/db/entities/machine.entity';
import { Organization } from 'src/db/entities/organization.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// таблица отказов узлов и деталей машин
@Entity()
export class Breakdown extends BaseEntity {
  // идентификатор
  @ApiProperty({
    description: 'идентификатор',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // привязка к организации
  @ApiProperty({
    description: 'привязка к организации',
  })
  @ManyToOne(() => Organization)
  organization: Organization;

  // привязка к машине, на которой произошел отказ узла/детали
  @ApiProperty({
    description: 'привязка к машине, на которой произошел отказ узла/детали',
  })
  @ManyToOne(() => Machine)
  machine: Machine;

  // указание на отказавший узел/деталь
  @ApiProperty({
    description: 'указание на отказавший узел/деталь',
  })
  @ManyToOne(() => MachinePart)
  part: MachinePart;

  // вид отказа - полный=true или частичный=false
  @ApiProperty({
    description: 'вид отказа - полный=true или частичный=false',
  })
  @Column()
  fullFailure: boolean;

  // вид дефекта
  @ApiProperty({
    description: 'вид дефекта',
  })
  @ManyToOne(() => Fault)
  fault: Fault;

  // дата фиксации отказа
  @ApiProperty({
    description: 'дата фиксации отказа',
  })
  @Column()
  dateStartFault: Date;

  // дата окончания отказа
  @ApiProperty({
    description: 'дата окончания отказа',
  })
  @Column()
  dateEndFault: Date;

  // показания счетчика машино-часов на машине (для вычисления наработок на отказ узла/детали и всей машины)
  @ApiProperty({
    description:
      'показания счетчика машино-часов на машине (для вычисления наработок на отказ узла/детали и всей машины)',
  })
  @Column({
    nullable: true,
  })
  timeMeter: number;

  // время ожидания ремонта
  @ApiProperty({
    description: 'время ожидания ремонта',
  })
  @Column()
  waitTime: number;

  // время самого ремонта (время восстановления работоспособности)
  @ApiProperty({
    description:
      'время самого ремонта (время восстановления работоспособности)',
  })
  @Column()
  repairTime: number;
}
