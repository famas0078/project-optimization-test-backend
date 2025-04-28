import { ApiProperty } from '@nestjs/swagger';
import { AdjustedCostMro } from 'src/db/entities/adjusted-cost-mro.entity';
import { AdjustedTimeMro } from 'src/db/entities/adjusted-time-mro.entity';
import { Cost } from 'src/db/entities/cost.entity';
import { EmergencyDowntime } from 'src/db/entities/emergency-downtime.entity';
import { Machine2Strategy } from 'src/db/entities/machine2strategy.entity';
import { MRO } from 'src/db/entities/mro.entity';
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

// таблица стратегий ТОиР
@Entity()
@Unique('unique-strategy-name', ['name', 'organization'])
export class MroStrategy extends BaseEntity {
  // идентификатор
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'идентификатор' })
  id: number;

  @ManyToOne(() => Organization)
  @ApiProperty({ description: 'привязка к организации' })
  organization: Organization;

  // наименование стратегии ТОиР
  @Column({
    unique: true,
  })
  @ApiProperty({ description: 'наименование стратегии ТОиР' })
  name: string;

  // новая техника вводится в работу с начала года (True) или с месяца списания старой (False)
  @Column({
    default: false,
  })
  @ApiProperty({
    description:
      'новая техника вводится в работу с начала года (True) или с месяца списания старой (False)',
  })
  workBeginYear: boolean;

  // описание стратегии ТОиР
  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'описание стратегии ТОиР' })
  notes: string;

  // привязка к таблице корректировки стоимости ТОиР и аварий
  @OneToMany(
    () => AdjustedCostMro,
    (adjustedCostMro: AdjustedCostMro) => adjustedCostMro.strategy,
  )
  @ApiProperty({
    description: 'привязка к таблице корректировки стоимости ТОиР и аварий',
  })
  adjustedCostsMro: AdjustedCostMro;

  // привязка к таблице корректировки времени работы машины на ТОиР и аварий
  @OneToMany(
    () => AdjustedTimeMro,
    (adjustedTimeMro: AdjustedTimeMro) => adjustedTimeMro.strategy,
  )
  @ApiProperty({
    description:
      'привязка к таблице корректировки времени работы машины на ТОиР и аварий',
  })
  adjustedTimeMro: AdjustedTimeMro;

  // привяззка к таблице фактических и расчетных (модельных) затрат на эксплуатацию
  @OneToMany(() => Cost, (cost: Cost) => cost.strategy)
  @ApiProperty({ description: 'привязка к таблице затрат на эксплуатацию' })
  costs: Cost[];

  // привязка к таблице неплановых простоев (аварий), зависящих от марки машины и ее возраста
  @OneToMany(
    () => EmergencyDowntime,
    (emergencyDowntime: EmergencyDowntime) => emergencyDowntime.strategy,
  )
  @ApiProperty({
    description:
      'привязка к таблице неплановых простоев (аварий), зависящих от марки машины и ее возраста',
  })
  emergencyDowntimes: EmergencyDowntime[];

  // привязка стратегии машинам и наоборот (многие-ко-многим)
  @OneToMany(
    () => Machine2Strategy,
    (machine2strategy: Machine2Strategy) => machine2strategy.strategy,
  )
  @ApiProperty({
    description: 'привязка стратегии машинам и наоборот (многие-ко-многим)',
  })
  machines: Machine2Strategy[];

  // привязка к таблице ТОиР
  @OneToMany(() => MRO, (mro: MRO) => mro.strategy)
  @ApiProperty({ description: 'привязка к таблице ТОиР' })
  mro: MRO[];
}
