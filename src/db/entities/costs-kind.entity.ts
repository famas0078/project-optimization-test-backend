import { ApiProperty } from '@nestjs/swagger';
import { Cost } from 'src/db/entities/cost.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// таблица-справочник видов учитываемых затрат
@Entity()
@Unique('unique-costs-kind', ['name', 'isModel'])
export class CostsKind extends BaseEntity {
  // идентификатор
  @ApiProperty({ description: 'идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  // наименование вида затрат
  @ApiProperty({ description: 'наименование вида затрат' })
  @Column()
  name: string;

  // флаг использования вида затрат для расчета (моделирования) будущих затрат (согласно модели "Жизнь машин")
  @ApiProperty({
    description:
      'флаг использования вида затрат для расчета (моделирования) будущих затрат (согласно модели "Жизнь машин")',
  })
  @Column()
  isModel: boolean;

  // примечание
  @ApiProperty({ description: 'примечание' })
  @Column({
    nullable: true,
  })
  notes: string;

  // привязка к журналу затрат
  @ApiProperty({ description: 'привязка к журналу затрат' })
  @OneToMany(() => Cost, (cost: Cost) => cost.kind)
  costs: Cost[];
}
