import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjustedCostMro } from './entities/adjusted-cost-mro.entity';
import { AdjustedTimeMro } from './entities/adjusted-time-mro.entity';
import { Breakdown } from './entities/breakdown.entity';
import { Cost } from './entities/cost.entity';
import { CostsKind } from './entities/costs-kind.entity';
import { CTFRecord } from './entities/ctf-records.entity';
import { EmergencyDowntime } from './entities/emergency-downtime.entity';
import { Face } from './entities/face.entity';
import { Fault } from './entities/fault.entity';
import { MachineClass } from './entities/machine-class.entity';
import { MachinePart } from './entities/machine-part.entity';
import { MachineType } from './entities/machine-type.entity';
import { Machine } from './entities/machine.entity';
import { Machine2Face } from './entities/machine2face.entity';
import { Machine2Strategy } from './entities/machine2strategy.entity';
import { MinePlan } from './entities/mine-plan.entity';
import { MroStrategy } from './entities/mro-strategy.entity';
import { MroTimePrice } from './entities/mro-time-price.entity';
import { MRO } from './entities/mro.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationalDowntime } from './entities/organizational-downtime.entity';
import { PlanVolume } from './entities/plan-volume.entity';
import { WorkTimeProductivity } from './entities/work-time-productivity.entity';
import { SeedsModule } from './seeds/seeds.module';
import { MachineMark } from './entities/machine-mark.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [
          Organization,
          Machine2Face,
          Face,
          MachineMark,
          MachineType,
          Machine,
          MachineClass,
          MroStrategy,
          Machine2Strategy,
          MRO,
          MroTimePrice,
          Cost,
          CostsKind,
          WorkTimeProductivity,
          EmergencyDowntime,
          OrganizationalDowntime,
          AdjustedTimeMro,
          AdjustedCostMro,
          MachinePart,
          Fault,
          Breakdown,
          MinePlan,
          PlanVolume,
          CTFRecord,
        ],
      }),
      inject: [ConfigService],
    }),
    SeedsModule,
  ],
})
export class DbModule {}
