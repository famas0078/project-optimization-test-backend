import { EmergencyDowntime } from 'src/db/entities/emergency-downtime.entity';
import { Machine2Face } from 'src/db/entities/machine2face.entity';
import { OrganizationalDowntime } from 'src/db/entities/organizational-downtime.entity';
import { Organization } from 'src/db/entities/organization.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// таблица подразделений (забоев) горного предприятия
@Entity()
@Unique('unique-face-name-per-organization', [
  'organization',
  'name',
  'zoneWorking',
])
export class Face extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  // привязка к организации
  @ManyToOne(() => Organization)
  @ApiProperty({ description: 'привязка к организации' })
  organization: Organization;

  // наименование и номер забоя в текущей организации
  @ApiProperty({
    description: 'наименование и номер забоя в текущей организации',
  })
  @Column()
  name: string;

  // зона работы на предприятии (вскрыша, добыча)
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'зона работы на предприятии (вскрыша, добыча)' })
  zoneWorking: string;

  // примечание
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'примечание' })
  notes: string;

  // привязка к журналу внеплановых простоев
  @OneToMany(
    () => EmergencyDowntime,
    (emergencyDowntime: EmergencyDowntime) => emergencyDowntime.face,
  )
  @ApiProperty({
    description: 'привязка к журналу внеплановых простоев',
  })
  emergencyDowntimes: EmergencyDowntime[];

  // привязка к журналу организационных простоев
  @OneToMany(
    () => OrganizationalDowntime,
    (organizationalDowntime: OrganizationalDowntime) =>
      organizationalDowntime.face,
  )
  @ApiProperty({
    description: 'привязка к журналу организационных простоев',
  })
  organizationalDowntimes: OrganizationalDowntime[];

  // привязка к машинам и их характеристикам
  @OneToMany(
    () => Machine2Face,
    (machine2face: Machine2Face) => machine2face.face,
  )
  @ApiProperty({
    description: 'привязка к машинам и их характеристикам',
  })
  machines: Machine2Face[];
}
