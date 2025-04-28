import { ApiProperty } from '@nestjs/swagger';
import { MRO } from 'src/db/entities/mro.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// журнал цен на ТОиР
@Entity()
export class MroTimePrice extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // вид ТОиР, для которого ведется журнал цен
  @ManyToOne(() => MRO)
  @ApiProperty({ description: 'вид ТОиР, для которого ведется журнал цен' })
  mro: MRO;

  // дата назначения новой цены
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'дата назначения новой цены' })
  dateChange: Date;

  // значение цены
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'значение цены' })
  value: number;
}
