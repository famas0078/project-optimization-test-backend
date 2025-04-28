import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Machine } from './machine.entity';

@Entity()
@Unique('unique-ctf-record', ['machine', 'datePeriod'])
export class CTFRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Machine)
  machine: Machine;

  @Column({
    type: 'timestamp',
  })
  datePeriod: Date;

  @Column({
    nullable: true,
    type: 'float',
  })
  ctf_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  ctf_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  worktime_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  worktime_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  PlannedOaTD_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  PlannedOaTD_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  UnplannedOaTD_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  UnplannedOaTD_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  TM_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  TR_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  MR_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  TM_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  TR_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  MR_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  PlannedRepair_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  PlannedRepair_c: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  UnplannedRepair_f: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  UnplannedRepair_c: number;
}
