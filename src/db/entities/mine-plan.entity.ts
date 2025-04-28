import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/db/entities/organization.entity';
import { PlanVolume } from 'src/db/entities/plan-volume.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица планов развития горных работ на будущие периоды
@Entity()
@Unique('unique-mine-plan', ['organization', 'name', 'yearPeriod'])
export class MinePlan {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // привязка к организации
  @ManyToOne(() => Organization)
  @ApiProperty({ description: 'привязка к организации' })
  organization: Organization;

  // наименование плана (у организации может быть несколько планов развития горных работ)
  @Column()
  @ApiProperty({ description: 'наименование плана' })
  name: string;

  // год плановой добычи и вскрыши (зоны работ)
  @Column()
  @ApiProperty({ description: 'год плановой добычи и вскрыши (зоны работ)' })
  yearPeriod: Date;

  // пояснение к плану развития горных работ
  @Column()
  @ApiProperty({ description: 'пояснение к плану развития горных работ' })
  notes: string;

  // привязка к таблице объемов работ для плана горных работ на будущие периоды
  @OneToMany(() => PlanVolume, (volume: PlanVolume) => volume.minePlan)
  @ApiProperty({ description: 'привязка к объемам работ' })
  planVolumes: PlanVolume[];
}
