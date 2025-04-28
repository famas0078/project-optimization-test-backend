import { ApiProperty } from '@nestjs/swagger';
import { AdjustedCostMro } from 'src/db/entities/adjusted-cost-mro.entity';
import { AdjustedTimeMro } from 'src/db/entities/adjusted-time-mro.entity';
import { Breakdown } from 'src/db/entities/breakdown.entity';
import { Cost } from 'src/db/entities/cost.entity';
import { MachineType } from 'src/db/entities/machine-type.entity';
import { Machine2Strategy } from 'src/db/entities/machine2strategy.entity';
import { Organization } from 'src/db/entities/organization.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CTFRecord } from './ctf-records.entity';
import type { Machine2Face } from './machine2face.entity';
import { WorkTimeProductivity } from './work-time-productivity.entity';

// таблица техники предприятия
@Entity()
@Unique('unique-machine-inventory-number-per-organization', [
  'organization',
  'inventoryNumber',
  'machineType',
])
export class Machine extends BaseEntity {
  // идентификатор
  @ApiProperty({
    description: 'идентификатор',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // ссылка на организацию/департамент
  @ApiProperty({
    description: 'ссылка на организацию/департамент',
  })
  @ManyToOne(() => Organization)
  organization: Organization;

  // наименование марки машины
  @ApiProperty({
    description: 'наименование марки машины',
  })
  @ManyToOne(() => MachineType)
  machineType: MachineType;

  // инвентарный (гаражный) номер (для новых машин, isNew=True, инв.№ должен содержать какой-нибудь "спецсимвол", например '#')
  @ApiProperty({
    description: 'инвентарный (гаражный) номер',
  })
  @Column()
  inventoryNumber: string;

  // дата ввода в эксплуатацию
  @ApiProperty({
    description: 'дата ввода в эксплуатацию',
  })
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dateEntry: Date;

  // первоначальная стоимость машины (на дату ввода в эксплуатацию)
  @ApiProperty({
    description:
      'первоначальная стоимость машины (на дату ввода в эксплуатацию)',
  })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  price: number;

  // сколько лет списывается стоимость машины (амортизация, лизинг)
  @ApiProperty({
    description:
      'сколько лет списывается стоимость машины (амортизация, лизинг)',
  })
  @Column({
    nullable: true,
  })
  pricePeriod: number;

  // год предполагаемого списания машины
  @ApiProperty({
    description: 'год предполагаемого списания машины',
  })
  @Column({
    nullable: true,
  })
  yearDecommission: Date;

  // признак новой машины, которую потенциально могут приобрести в парк машин
  @ApiProperty({
    description:
      'признак новой машины, которую потенциально могут приобрести в парк машин',
  })
  @Column({
    nullable: true,
  })
  isNew: boolean;

  // количество доступных новых машин для приобретения в новый парк (указывается только для новых машин, isnew=TRUE and inventoryNumber='#')
  @ApiProperty({
    description:
      'количество доступных новых машин для приобретения в новый парк',
  })
  @Column({
    nullable: true,
  })
  countNew: number;

  // примечание
  @ApiProperty({
    description: 'примечание',
  })
  @Column({
    nullable: true,
  })
  notes: string;

  // привязка к журналу стоимости ТОиР и аварий
  @ApiProperty({
    description: 'привязка к журналу стоимости ТОиР и аварий',
  })
  @OneToMany(
    () => AdjustedCostMro,
    (adjustedCostMro: AdjustedCostMro) => adjustedCostMro.machine,
  )
  adjustedCostsMro: AdjustedCostMro[];

  // привязка к таблице корректировки времени работы машины на ТОиР и аварий
  @ApiProperty({
    description:
      'привязка к таблице корректировки времени работы машины на ТОиР и аварий',
  })
  @OneToMany(
    () => AdjustedTimeMro,
    (adjustedTimeMro: AdjustedTimeMro) => adjustedTimeMro.machine,
  )
  adjustedTimeMro: AdjustedTimeMro[];

  // привязка к журналу отказов узлов и деталей машин
  @ApiProperty({
    description: 'привязка к журналу отказов узлов и деталей машин',
  })
  @OneToMany(() => Breakdown, (breakdown: Breakdown) => breakdown.machine)
  breakdowns: Breakdown[];

  // привязка к таблице фактических и расчетных (модельных) затрат на эксплуатацию
  @ApiProperty({
    description:
      'привязка к таблице фактических и расчетных (модельных) затрат на эксплуатацию',
  })
  @OneToMany(() => Cost, (cost: Cost) => cost.machine)
  costs: Cost[];

  // Привязка к стратегии ТОиР
  @ApiProperty({
    description: 'Привязка к стратегии ТОиР',
  })
  @OneToMany(() => Machine2Strategy, (m2s: Machine2Strategy) => m2s.machine)
  strategies: Machine2Strategy[];

  // Привязка к записям КФВ
  @ApiProperty({
    description: 'Привязка к записям КФВ',
  })
  @OneToMany(() => CTFRecord, (ctfRecord: CTFRecord) => ctfRecord.machine)
  ctfRecords: CTFRecord[];

  @ApiProperty({
    description: 'Привязка к привязке машины к забою',
  })
  @OneToOne(
    'Machine2Face',
    (machine2face: Machine2Face) => machine2face.machine,
  )
  machine2face: Machine2Face;

  @OneToMany(() => WorkTimeProductivity, (productivity) => productivity.machine)
  workTimeProductivity: WorkTimeProductivity[];
}
