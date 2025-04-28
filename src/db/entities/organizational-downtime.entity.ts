import { ApiProperty } from '@nestjs/swagger';
import { Face } from 'src/db/entities/face.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица организационных простоев, присущих конкретному забою предприятия
@Entity()
@Unique('unique-organization-downtime', ['face', 'dateChange'])
export class OrganizationalDowntime {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // ссылка на забой где работает машина (и опосредованно ссылка на организацию/департамент)
  @ManyToOne(() => Face)
  @ApiProperty({
    description:
      'ссылка на забой где работает машина (и опосредованно ссылка на организацию/департамент)',
  })
  face: Face;

  // начало периода действия нового коэффициента
  @Column()
  @ApiProperty({ description: 'начало периода действия нового коэффициента' })
  dateChange: Date;

  // коэффициент организационных простоев
  @Column()
  @ApiProperty({ description: 'коэффициент организационных простоев' })
  factorOrganizational: number;
}
