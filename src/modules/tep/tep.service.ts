import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Face } from '../../db/entities/face.entity';
import { Repository } from 'typeorm';
import { Machine2Face } from '../../db/entities/machine2face.entity';
import {
  IInputDataForCostComparison,
  IInputDataForDynamicsOfUnitAccumulatedCosts,
  IInputDataForDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement,
  IInputDataForDynamicsOfUnitCosts,
  IInputDataForProductivity,
  IInputDataForVolumes,
} from './interfaces/tep.interface';
import { WorkTimeProductivity } from '../../db/entities/work-time-productivity.entity';
import { Cost } from '../../db/entities/cost.entity';
import { MachinesService } from '../machines/machines.service';
import { User } from '../../db/entities/user.entity';
import { Machine } from '../../db/entities/machine.entity';

@Injectable()
export class TepService {
  private readonly logger = new Logger(TepService.name);

  constructor(
    @InjectRepository(Face)
    private readonly faceRepository: Repository<Face>,
    @InjectRepository(Machine2Face)
    private readonly machine2FaceRepository: Repository<Machine2Face>,
    @InjectRepository(WorkTimeProductivity)
    private readonly workTimeProductivityRepository: Repository<WorkTimeProductivity>,
    @InjectRepository(Cost)
    private readonly costRepository: Repository<Cost>,
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    private readonly machineListService: MachinesService,
  ) {}

  async getVolumesProductionAndStripping(
    user: User,
    data: IInputDataForVolumes,
  ) {
    try {
      const machines = await this.machineListService.filterMachines(
        user.organization.id,
        data.machineClassIds,
        data.machineMarkIds,
        data.machineTypeIds,
        data.machineIds,
        // data.dateStart,
        // data.dateEnd,
      );
      const machineIds = machines.map((machine) => machine.id);

      if (machineIds.length == 0) {
        throw new HttpException(
          'Данных по выбранному фильтру не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const results = await this.machine2FaceRepository
          .createQueryBuilder('machine2Face')
          .leftJoinAndSelect('machine2Face.face', 'face')
          .leftJoinAndSelect('machine2Face.machine', 'machine')
          .leftJoinAndSelect(
              'machine.workTimeProductivity',
              'productivity',
              'productivity.datePeriod BETWEEN DATE(:start) AND DATE(:end) AND productivity.isModel = false',
              { start: data.dateStart, end: data.dateEnd }
          )
          .andWhere('machine2Face.machineId IN (:...machineIds)', {
            machineIds: machineIds,
          })
          .getMany();

      const modifiedData = await this.aggregateResults(
        results,
        data.breakdownType,
        data,
      );

      modifiedData.forEach((entry) => {
        entry.coefficient =
          entry.extraction > 0 ? entry.overburden / entry.extraction : 0;
      });

      if (data.breakdownType === 'year') {
        modifiedData.sort((a, b) => a.year - b.year);
      } else if (data.breakdownType === 'quarter') {
        modifiedData.sort(
          (a, b) => a.year - b.year || (a.quarter || 0) - (b.quarter || 0),
        );
      } else if (data.breakdownType === 'month') {
        modifiedData.sort(
          (a, b) => a.year - b.year || (a.month || 0) - (b.month || 0),
        );
      }

      return modifiedData;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private async aggregateResults(
    results: Machine2Face[],
    breakdownType: 'year' | 'quarter' | 'month',
    data: IInputDataForVolumes,
  ) {
    const finalArray = [];

    const formatDateInfo = (date: Date) => {
      const year = date.getFullYear();
      let quarter;
      let month;

      if (breakdownType === 'quarter') {
        quarter = Math.floor(date.getMonth() / 3) + 1;
      } else if (breakdownType === 'month') {
        month = date.getMonth() + 1;
      }

      return { year, quarter, month };
    };

    results.forEach((result) => {
      result.machine.workTimeProductivity.forEach((productivity) => {
        const dateInfo = formatDateInfo(new Date(productivity.datePeriod));
        const year = dateInfo.year;
        const quarter =
            breakdownType === 'quarter'
                ? Math.floor(dateInfo.quarter / 3) + 1
                : undefined;
        const month = breakdownType === 'month' ? dateInfo.month : undefined;

        let summaryEntry = finalArray.find(
            (result) =>
                result.year === dateInfo.year &&
                (breakdownType === 'quarter'
                    ? result.quarter === dateInfo.quarter
                    : true) &&
                (breakdownType === 'month' ? result.month === dateInfo.month : true),
        );

        if (!summaryEntry) {
          summaryEntry = {
            year,
            quarter,
            month,
            extraction: 0,
            overburden: 0,
            combinedDate:
                breakdownType === 'year'
                    ? `${year}`
                    : breakdownType === 'quarter'
                        ? `${year}-Q${quarter}`
                        : `${year}-${month < 10 ? '0' + month : month}`,
          };

          finalArray.push(summaryEntry);
        }

        const totalProductivity = Number(productivity.productivity) || 0
        const faceType = result.face.zoneWorking;

        if (faceType === 'Добыча') {
          summaryEntry.extraction += totalProductivity
        } else if (faceType === 'Вскрыша') {
          summaryEntry.overburden += totalProductivity
        }
      })

    });

    const startDate = new Date(data.dateStart);
    const endDate = new Date(data.dateEnd);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const year = d.getFullYear();
      const quarter = Math.floor(d.getMonth() / 3) + 1;
      const month = d.getMonth() + 1;

      const existingEntry = finalArray.find(
        (entry) =>
          entry.year === year &&
          (breakdownType === 'quarter' ? entry.quarter === quarter : true) &&
          (breakdownType === 'month' ? entry.month === month : true),
      );

      if (!existingEntry) {
        const newEntry = {
          year,
          quarter: breakdownType === 'quarter' ? quarter : undefined,
          month: breakdownType === 'month' ? month : undefined,
          extraction: 0,
          stripping: 0,
          combinedDate:
            breakdownType === 'year'
              ? `${year}`
              : breakdownType === 'quarter'
                ? `${year}-Q${quarter}`
                : `${year}-${month < 10 ? '0' + month : month}`,
        };

        finalArray.push(newEntry);
      }
    }

    return finalArray;
  }

  async getMonthlyParkProductivity(
    user: User,
    data: IInputDataForProductivity,
  ) {
    try {
      let machines;
      let machineIds;

      if (data.machineIds) {
        machines = await this.machineListService.filterMachines(
          user.organization.id,
          data.machineClassIds,
          data.machineMarkIds,
          data.machineTypeIds,
          data.machineIds,
          // data.dateStart,
          // data.dateEnd,
        );
        machineIds = machines.map((machine) => machine.id);
      } else {
        machines = await this.machineListService.filterMachines(
          user.organization.id,
          data.machineClassIds,
          data.machineMarkIds,
          data.machineTypeIds,
          data.machineIds,
          // data.dateStart,
          // data.dateEnd,
        );
        machineIds = machines.map((machine) => machine.id);
      }

      if (machineIds.length == 0) {
        throw new HttpException(
          'Данных по выбранному фильтру не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const results = await this.workTimeProductivityRepository
        .createQueryBuilder('workTimeProductivity')
        .leftJoinAndSelect('workTimeProductivity.machine', 'machine')
        .leftJoinAndSelect('machine.machineType', 'type')
        .leftJoinAndSelect('type.mark', 'mark')
        .leftJoinAndSelect('type.machineClass', 'class')
        .where(
          'workTimeProductivity.datePeriod BETWEEN DATE(:start) AND DATE(:end)',
          {
            start: data.dateStart,
            end: data.dateEnd,
          },
        )
        .andWhere('workTimeProductivity.machineId IN (:...machineIds)', {
          machineIds: machineIds,
        })
        .getMany();

      const modifiedData = await this.aggregateProductivityResults(
        results,
        data.breakdownType,
        data,
        (data.machineIds ? data.machineIds.length === 0 : true) &&
          data.machineClassIds &&
          data.machineClassIds.length > 0,
      );

      modifiedData.sort((a, b) => a.machineId - b.machineId);

      modifiedData.forEach((machineData) => {
        machineData.data.sort((a, b) => {
          if (a.year === b.year) {
            if (data.breakdownType === 'quarter') {
              return (a.quarter || 0) - (b.quarter || 0);
            }
            if (data.breakdownType === 'month') {
              return (a.month || 0) - (b.month || 0);
            }
            return 0;
          }
          return a.year - b.year;
        });
      });

      return modifiedData;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private async aggregateProductivityResults(
    results: WorkTimeProductivity[],
    breakdownType: 'year' | 'quarter' | 'month',
    data: IInputDataForProductivity,
    aggregateByClass: boolean,
  ) {
    const finalArray = [];

    const formatDateInfo = (date: Date) => {
      const year = date.getFullYear();
      let quarter: number | undefined;
      let month: number | undefined;

      if (breakdownType === 'quarter') {
        quarter = Math.floor(date.getMonth() / 3) + 1;
      } else if (breakdownType === 'month') {
        month = date.getMonth() + 1;
      }

      return { year, quarter, month };
    };

    results.forEach((result) => {
      const dateInfo = formatDateInfo(new Date(result.datePeriod));
      const year = dateInfo.year;
      const quarter = dateInfo.quarter;
      const month = dateInfo.month;
      const machineId = result.machine.id;
      const markName = result.machine.machineType.mark.name;
      const typeName = result.machine.machineType.name
      const machineClassId = result.machine.machineType.machineClass.id
      const machineClassName = result.machine.machineType.machineClass.name
      const inventory = result.machine.inventoryNumber

      let machineData;
      if (aggregateByClass) {
        machineData = finalArray.find(
          (entry) => entry.machineClassId === machineClassId,
        );
        //TODO выбрав класс 1 - приходят только 4 и 5 тип
        //180, 190, 194, 204, 212, 224, 228, 238, 182, 191,
        //   201, 209, 217, 226, 235, 245, 176, 185, 200, 213,
        //   222, 233, 239, 178, 187, 195, 208, 220, 234, 241,
        //   179, 189, 198, 207, 219, 229, 242, 177, 188, 197,
        //   205, 215, 225, 236, 246, 175, 181, 193, 203, 214,
        //   223, 231, 244, 174, 183, 192, 202, 211, 221, 230,
        //   240, 184, 199, 210, 216, 227, 237, 186, 196, 206,
        //   218, 232, 243
        if (!machineData) {
          machineData = {
            machineClassId: machineClassId,
            machineClassName: machineClassName,
            data: [],
          };
          finalArray.push(machineData);
        }
      } else {
        machineData = finalArray.find((entry) => entry.machineId === machineId);

        if (!machineData) {
          machineData = {
            machineId: machineId,
            markName: markName + '-' + typeName + '-' + inventory,
            data: [],
          };
          finalArray.push(machineData);
        }
      }

      let summaryEntry;

      if (breakdownType === 'year') {
        summaryEntry = machineData.data.find((entry) => entry.year === year);
        if (!summaryEntry) {
          summaryEntry = {
            year,
            productivity: result.productivity,
            combinedDate: `${year}`,
          };
          machineData.data.push(summaryEntry);
        } else {
          summaryEntry.productivity += result.productivity;
        }
      } else if (breakdownType === 'quarter') {
        summaryEntry = machineData.data.find(
          (entry) => entry.year === year && entry.quarter === quarter,
        );
        if (!summaryEntry) {
          summaryEntry = {
            year,
            quarter,
            productivity: result.productivity,
            combinedDate: `${year}-Q${quarter}`,
          };
          machineData.data.push(summaryEntry);
        } else {
          summaryEntry.productivity += result.productivity;
        }
      } else {
        //month
        summaryEntry = machineData.data.find(
          (entry) => entry.year === year && entry.month === month,
        );
        if (!summaryEntry) {
          summaryEntry = {
            year,
            month,
            productivity: result.productivity,
            combinedDate: `${year}-${month < 10 ? '0' + month : month}`,
          };
          machineData.data.push(summaryEntry);
        } else {
          summaryEntry.productivity += result.productivity;
        }
      }
    });

    const startDate = new Date(data.dateStart);
    const endDate = new Date(data.dateEnd);

    for (const machineData of finalArray) {
      let date = new Date(startDate);
      while (date <= endDate) {
        const year = date.getFullYear();

        if (breakdownType === 'year') {
          if (!machineData.data.some((entry) => entry.year === year)) {
            machineData.data.push({
              year,
              productivity: 0,
              combinedDate: `${year}`,
            });
          }
          date = new Date(year + 1, 0, 1);
        } else if (breakdownType === 'quarter') {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          if (
            !machineData.data.some(
              (entry) => entry.year === year && entry.quarter === quarter,
            )
          ) {
            machineData.data.push({
              year,
              quarter,
              productivity: 0,
              combinedDate: `${year}-Q${quarter}`,
            });
          }
          date.setMonth(date.getMonth() + 3);
        } else {
          // breakdownType === 'month'
          const month = date.getMonth() + 1;
          if (
            !machineData.data.some(
              (entry) => entry.year === year && entry.month === month,
            )
          ) {
            machineData.data.push({
              year,
              month,
              productivity: 0,
              combinedDate: `${year}-${month < 10 ? '0' + month : month}`,
            });
          }
          date.setMonth(date.getMonth() + 1);
        }
      }
    }

    return finalArray;
  }

  async getDynamicsOfUnitCosts(
    user: User,
    data: IInputDataForDynamicsOfUnitCosts,
  ) {
    try {
      const machines = await this.machineListService.filterMachines(
        user.organization.id,
        data.machineClassIds,
        data.machineMarkIds,
        data.machineTypeIds,
        data.machineIds,
        // data.dateStart,
        // data.dateEnd,
      );
      const machineIds = machines.map((machine) => machine.id);

      if (machineIds.length == 0) {
        throw new HttpException(
          'Данных по выбранному фильтру не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const costs = await this.costRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.kind', 'kind')
        .leftJoinAndSelect('cost.machine', 'machine')
        .where('cost.machineId IN (:...machineIds)', { machineIds: machineIds })
        .andWhere('cost.isModel = false')
        .andWhere('cost.datePeriod BETWEEN DATE(:start) AND DATE(:end)', {
          start: data.dateStart,
          end: data.dateEnd,
        })
        .getMany();

      const productivity = await this.workTimeProductivityRepository
        .createQueryBuilder('workTimeProductivity')
        .leftJoinAndSelect('workTimeProductivity.machine', 'machine')
        .where('workTimeProductivity.machineId IN (:...machineIds)', {
          machineIds: machineIds,
        })
        .andWhere('workTimeProductivity.isModel = false')
        .andWhere(
          'workTimeProductivity.datePeriod BETWEEN DATE(:start) AND DATE(:end)',
          {
            start: data.dateStart,
            end: data.dateEnd,
          },
        )
        .getMany();

      const result = await this.aggregateDynamicsOfUnitCosts(
        costs,
        productivity,
        data.breakdownType,
        data,
      );

      const summedResults = await this.sumCostToProductivityRatios(
        result,
        data.breakdownType,
      );

      result.push({
        kindId: null,
        kindName: 'Total',
        data: summedResults,
      });

      return result;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private async aggregateDynamicsOfUnitCosts(
    costs: Cost[],
    productivity: WorkTimeProductivity[],
    breakdownType: 'year' | 'quarter' | 'month',
    data: IInputDataForDynamicsOfUnitCosts,
  ) {
    const aggregatedResults = [];

    const formatDateInfo = (date: Date) => {
      const year = date.getFullYear();
      let quarter;
      let month;

      if (breakdownType === 'quarter') {
        quarter = Math.floor(date.getMonth() / 3) + 1;
      } else if (breakdownType === 'month') {
        month = date.getMonth() + 1;
      }

      return { year, quarter, month };
    };

    for (const cost of costs) {
      const dateInfo = formatDateInfo(new Date(cost.datePeriod));

      let kindEntry = aggregatedResults.find(
        (entry) => entry.kindId === cost.kind.id,
      );

      if (!kindEntry) {
        kindEntry = {
          kindId: cost.kind.id,
          kindName: cost.kind.name,
          data: [],
        };
        aggregatedResults.push(kindEntry);
      }

      let resultEntry = kindEntry.data.find(
        (result) =>
          result.year === dateInfo.year &&
          (breakdownType === 'quarter'
            ? result.quarter === dateInfo.quarter
            : true) &&
          (breakdownType === 'month' ? result.month === dateInfo.month : true),
      );

      if (!resultEntry) {
        resultEntry = {
          year: dateInfo.year,
          quarter: breakdownType === 'quarter' ? dateInfo.quarter : undefined,
          month: breakdownType === 'month' ? dateInfo.month : undefined,
          totalCost: 0,
          totalProductivity: 0,
          costToProductivityRatio: 0,
          combinedDate:
            breakdownType === 'year'
              ? `${dateInfo.year}`
              : breakdownType === 'quarter'
                ? `${dateInfo.year}-Q${dateInfo.quarter}`
                : `${dateInfo.year}-${dateInfo.month < 10 ? '0' + dateInfo.month : dateInfo.month}`,
        };
        kindEntry.data.push(resultEntry);
      }

      resultEntry.totalCost += cost.value;
    }

    for (const workTime of productivity) {
      const dateInfo = formatDateInfo(new Date(workTime.datePeriod));

      for (const kindEntry of aggregatedResults) {
        for (const resultEntry of kindEntry.data) {
          if (
            (breakdownType === 'year' && resultEntry.year === dateInfo.year) ||
            (breakdownType === 'quarter' &&
              resultEntry.year === dateInfo.year &&
              resultEntry.quarter === dateInfo.quarter) ||
            (breakdownType === 'month' &&
              resultEntry.year === dateInfo.year &&
              resultEntry.month === dateInfo.month)
          ) {
            resultEntry.totalProductivity += workTime.productivity;

            if (resultEntry.totalProductivity > 0) {
              resultEntry.costToProductivityRatio =
                resultEntry.totalCost / resultEntry.totalProductivity;
            }
          }
        }
      }
    }

    const startDate = new Date(data.dateStart);
    const endDate = new Date(data.dateEnd);

    while (startDate <= endDate) {
      const year = startDate.getFullYear();

      if (breakdownType === 'quarter') {
        const quarter = Math.floor(startDate.getMonth() / 3) + 1;

        aggregatedResults.forEach((kindEntry) => {
          if (
            !kindEntry.data.some(
              (entry) => entry.year === year && entry.quarter === quarter,
            )
          ) {
            const dataEntry = {
              year,
              quarter,
              month: undefined,
              totalCost: 0,
              totalProductivity: 0,
              costToProductivityRatio: 0,
              combinedDate: `${year}-Q${quarter}`,
            };
            kindEntry.data.push(dataEntry);
          }
        });

        startDate.setMonth(startDate.getMonth() + 3);
      } else if (breakdownType === 'month') {
        const month = startDate.getMonth() + 1;

        aggregatedResults.forEach((kindEntry) => {
          if (
            !kindEntry.data.some(
              (entry) => entry.year === year && entry.month === month,
            )
          ) {
            const dataEntry = {
              year,
              quarter: undefined,
              month,
              totalCost: 0,
              totalProductivity: 0,
              costToProductivityRatio: 0,
              combinedDate: `${year}-${month < 10 ? '0' + month : month}`,
            };
            kindEntry.data.push(dataEntry);
          }
        });

        startDate.setMonth(startDate.getMonth() + 1);
      } else {
        if (
          !aggregatedResults.some((kindEntry) =>
            kindEntry.data.some(
              (entry) => entry.year === year && !entry.quarter && !entry.month,
            ),
          )
        ) {
          aggregatedResults.forEach((kindEntry) => {
            const dataEntry = {
              year,
              quarter: undefined,
              month: undefined,
              totalCost: 0,
              totalProductivity: 0,
              costToProductivityRatio: 0,
              combinedDate: `${year}`,
            };
            kindEntry.data.push(dataEntry);
          });
        }

        startDate.setFullYear(year + 1);
      }
    }

    aggregatedResults.forEach((kindEntry) => {
      kindEntry.data.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (breakdownType === 'quarter')
          return (a.quarter || 0) - (b.quarter || 0);
        if (breakdownType === 'month') return (a.month || 0) - (b.month || 0);
        return 0;
      });
    });

    return aggregatedResults;
  }

  private async sumCostToProductivityRatios(
    aggregatedResults: any[],
    breakdownType: 'year' | 'quarter' | 'month',
  ) {
    const summedData: {
      year: number;
      quarter?: number;
      month?: string;
      totalCostToProductivityRatio: number;
    }[] = [];

    aggregatedResults.forEach((kindEntry) => {
      kindEntry.data.forEach((entry) => {
        const existingEntry = summedData.find(
          (s) =>
            s.year === entry.year &&
            (breakdownType === 'quarter'
              ? s.quarter === entry.quarter
              : true) &&
            (breakdownType === 'month' ? s.month === entry.month : true),
        );

        if (existingEntry) {
          existingEntry.totalCostToProductivityRatio +=
            entry.costToProductivityRatio;
        } else {
          summedData.push({
            year: entry.year,
            quarter: breakdownType === 'quarter' ? entry.quarter : undefined,
            month: breakdownType === 'month' ? entry.month : undefined,
            totalCostToProductivityRatio: entry.costToProductivityRatio,
          });
        }
      });
    });

    return summedData;
  }

  async getCostComparison(user: User, data: IInputDataForCostComparison) {
    try {
      const machines = await this.machineListService.filterMachines(
        user.organization.id,
        data.machineClassIds,
        data.machineMarkIds,
        data.machineTypeIds,
        data.machineIds,
        // data.dateStart,
        // data.dateEnd,
      );
      const machineIds = machines.map((machine) => machine.id);

      if (machineIds.length == 0) {
        throw new HttpException(
          'Данных по выбранному фильтру не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const costs = await this.costRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.kind', 'kind')
        .leftJoinAndSelect('cost.machine', 'machine')
        .where('cost.machineId IN (:...machineIds)', { machineIds: machineIds })
        .andWhere('cost.datePeriod BETWEEN DATE(:start) AND DATE(:end)', {
          start: data.dateStart,
          end: data.dateEnd,
        })
        .getMany();

      const actualCosts = costs.filter((cost) => !cost.isModel);
      const plannedCosts = costs.filter((cost) => cost.isModel);

      const aggregatedActualCosts =
        await this.aggregateCostsByKind(actualCosts);
      const aggregatedPlannedCosts =
        await this.aggregateCostsByKind(plannedCosts);

      return [
        { type: 'Факт', costs: aggregatedActualCosts },
        { type: 'Цель', costs: aggregatedPlannedCosts },
      ];
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private async aggregateCostsByKind(costs: Cost[]) {
    const aggregatedResults = [];

    for (const cost of costs) {
      let kindEntry = aggregatedResults.find(
        (entry) => entry.kindId === cost.kind.id,
      );

      if (!kindEntry) {
        kindEntry = {
          kindId: cost.kind.id,
          kindName: cost.kind.name,
          totalCost: 0,
        };
        aggregatedResults.push(kindEntry);
      }

      kindEntry.totalCost += cost.value;
    }

    return aggregatedResults;
  }

  async getOwnershipCostStructure(user, data) {
    const machines = await this.machineListService.filterMachines(
      user.organization.id,
      data.machineClassIds,
      data.machineMarkIds,
      data.machineTypeIds,
      data.machineIds,
      // data.dateStart,
      // data.dateEnd,
    );
    const machineIds = machines.map((machine) => machine.id);

    if (machineIds.length == 0) {
      throw new HttpException(
        'Данных по выбранному фильтру не найдено',
        HttpStatus.NO_CONTENT,
      );
    }

    const costs = await this.costRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.kind', 'kind')
      .leftJoinAndSelect('cost.machine', 'machine')
      .where('cost.machineId IN (:...machineIds)', { machineIds: machineIds })
      .andWhere('cost.isModel = false')
      .andWhere('cost.datePeriod BETWEEN DATE(:start) AND DATE(:end)', {
        start: data.dateStart,
        end: data.dateEnd,
      })
      .getMany();

    const productivity = await this.workTimeProductivityRepository
      .createQueryBuilder('workTimeProductivity')
      .leftJoinAndSelect('workTimeProductivity.machine', 'machine')
      .where('workTimeProductivity.machineId IN (:...machineIds)', {
        machineIds: machineIds,
      })
      .andWhere('workTimeProductivity.isModel = false')
      .andWhere(
        'workTimeProductivity.datePeriod BETWEEN DATE(:start) AND DATE(:end)',
        {
          start: data.dateStart,
          end: data.dateEnd,
        },
      )
      .getMany();

    const results = [];

    for (const machine of machines) {
      const machineData = await this.machineRepository.findOne({
        where: {
          id: machine.id,
        },
        relations: {
          machineType: {
            mark: true,
          },
        },
      });

      const machineCosts = costs.filter(
        (cost) => cost.machine.id === machine.id,
      );
      const machineProductivity = productivity.filter(
        (productivity) => productivity.machine.id === machine.id,
      );

      const aggregatedCosts = await this.aggregateMachineCosts(
        machineData,
        machineCosts,
        machineProductivity,
      );

      results.push(aggregatedCosts);
    }

    return results;
  }

  private async aggregateMachineCosts(
    machine,
    costs: Cost[],
    productivity: WorkTimeProductivity[],
  ) {
    const machineCosts = costs.filter((cost) => cost.machine.id === machine.id);
    const machineProductivity = productivity.filter(
      (productivity) => productivity.machine.id === machine.id,
    );

    const aggregatedResults = [];

    for (const cost of machineCosts) {
      let kindEntry = aggregatedResults.find(
        (entry) => entry.kindId === cost.kind.id,
      );

      if (!kindEntry) {
        kindEntry = {
          kindId: cost.kind.id,
          kindName: cost.kind.name,
          totalCost: 0,
          totalProductivity: 0,
          costToProductivityRatio: 0,
        };
        aggregatedResults.push(kindEntry);
      }

      kindEntry.totalCost += cost.value;
    }

    for (const workTime of machineProductivity) {
      for (const kindEntry of aggregatedResults) {
        kindEntry.totalProductivity += workTime.productivity;

        if (kindEntry.totalProductivity > 0) {
          kindEntry.costToProductivityRatio =
            kindEntry.totalCost / kindEntry.totalProductivity;
        }
      }
    }

    const machinePrice = machine.price;
    const totalProductivity = machineProductivity.reduce(
      (acc, item) => acc + item.productivity,
      0,
    );

    if (totalProductivity > 0) {
      const machineCostPerProductivity = machinePrice / totalProductivity;

      aggregatedResults.push({
        kindId: null,
        kindName: 'Удельная стоимость',
        totalCost: machinePrice,
        totalProductivity: totalProductivity,
        costToProductivityRatio: machineCostPerProductivity,
      });
    }

    // Группировка затрат по видам
    const maintenanceAndRepairCosts = aggregatedResults
      .filter(
        (ratio) =>
          [1, 2, 5, 6, 9, 10].includes(ratio.kindId) ||
          ['Автошины', 'ТО', 'ТР'].includes(ratio.kindName),
      )
      .reduce((acc, ratio) => acc + ratio.costToProductivityRatio, 0);

    const otherCosts = aggregatedResults
      .filter(
        (ratio) =>
          [3, 4].includes(ratio.kindId) || ['Прочее'].includes(ratio.kindName),
      )
      .reduce((acc, ratio) => acc + ratio.costToProductivityRatio, 0);

    const laborAndTaxesCosts = aggregatedResults
      .filter((ratio) => ['ФОТ', 'Налоги'].includes(ratio.kindName))
      .reduce((acc, ratio) => acc + ratio.costToProductivityRatio, 0);

    const fuelCosts = aggregatedResults
      .filter(
        (ratio) =>
          [7, 8].includes(ratio.kindId) || ['Топливо'].includes(ratio.kindName),
      )
      .reduce((acc, ratio) => acc + ratio.costToProductivityRatio, 0);

    //метод optional chaining - необязательная цепочка)
    const specificCost =
      aggregatedResults.find((ratio) => ratio.kindName === 'Удельная стоимость')
        ?.costToProductivityRatio || 0;

    const totalCost =
      maintenanceAndRepairCosts +
      otherCosts +
      laborAndTaxesCosts +
      fuelCosts +
      specificCost;

    return {
      machineId: machine.id,
      markName: machine.machineType.mark.name + '-' + machine.machineType.name + '-' + machine.inventoryNumber,
      data: [
        {
          type: 'Удельная стоимость (стоимость приобретения/к общему объему отгруженного за период) руб/м3',
          specificCost,
        },
        {
          type: 'Удельные затраты на ТО, ТР, Запасные части и услуги по ТОР, руб/м3',
          maintenanceAndRepairCosts,
        },
        { type: 'Удельные затраты на Прочее, руб/м3', otherCosts },
        {
          type: 'Удельные затраты на ФОТ и налоги, руб/м3',
          laborAndTaxesCosts,
        },
        { type: 'Удельные затраты на эксплуатацию, руб/м3', fuelCosts },
        { type: 'ИТОГО удельные затраты на владение', totalCost },
      ],
    };
  }

  async getDynamicsOfUnitAccumulatedCosts(
    user: User,
    data: IInputDataForDynamicsOfUnitAccumulatedCosts,
  ) {
    try {
      const machines = await this.machineListService.filterMachines(
        user.organization.id,
        data.machineClassIds,
        data.machineMarkIds,
        data.machineTypeIds,
        data.machineIds,
        // data.dateStart,
        // data.dateEnd,
      );

      if (machines.length === 0) {
        throw new HttpException(
          'Данных по выбранному фильтру не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const machineIds = machines.map((machine) => machine.id);

      const costs = await this.costRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.machine', 'machine')
        .where('cost.machineId IN (:...machineIds)', { machineIds: machineIds })
        .andWhere('cost.isModel = false')
        .andWhere('cost.datePeriod BETWEEN DATE(:start) AND DATE(:end)', {
          start: data.dateStart,
          end: data.dateEnd,
        })
        .getMany();

      const productivity = await this.workTimeProductivityRepository
        .createQueryBuilder('workTimeProductivity')
        .leftJoinAndSelect('workTimeProductivity.machine', 'machine')
        .where('workTimeProductivity.machineId IN (:...machineIds)', {
          machineIds: machineIds,
        })
        .andWhere('workTimeProductivity.isModel = false')
        .andWhere(
          'workTimeProductivity.datePeriod BETWEEN DATE(:start) AND DATE(:end)',
          {
            start: data.dateStart,
            end: data.dateEnd,
          },
        )
        .getMany();

      const result = [];

      for (const machine of machines) {
        const machineData = await this.machineRepository.findOne({
          where: {
            id: machine.id,
          },
          relations: {
            machineType: {
              mark: true,
            },
          },
        });

        const machineResult = {
          machineId: machineData.id,
          markName: machineData.machineType.mark.name + '-' + machineData.machineType.name + '-' + machineData.inventoryNumber,
          data: await this.calculateAccumulatedDataForMachine(
            machineData,
            costs,
            productivity,
            data.dateStart,
            data.dateEnd,
            data.breakdownType
          ),
        };

        result.push(machineResult);
      }

      return result;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private async calculateAccumulatedDataForMachine(
      machine,
      costs: Cost[],
      productivity: WorkTimeProductivity[],
      dateStart: Date,
      dateEnd: Date,
      breakdownType: 'year' | 'quarter' | 'month'
  ) {
    const machineCosts = costs.filter((cost) => cost.machine.id === machine.id);
    const machineProductivity = productivity.filter(
      (productivity) => productivity.machine.id === machine.id,
    );
    const machineCost = machine.price || 0;
    const commissioningYear = machine.dateEntry
        ? new Date(machine.dateEntry).getFullYear()
        : null
    const getDateInfo = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const quarter = Math.floor((month - 1) / 3) + 1

      return { year, quarter, month }
    };

    const accumulatedData = []

    const findOrCreateEntry = (year, quarter?, month?) => {
      let entry = accumulatedData.find((e) => {
        if (e.year !== year) return false
        if (breakdownType === 'quarter' && e.quarter !== quarter) return false
        return !(breakdownType === 'month' && e.month !== month);

      })

      if (!entry) {
        entry = {
          year,
          quarter: breakdownType === 'quarter' ? quarter : undefined,
          month: breakdownType === 'month' ? month : undefined,
          accumulatedCost: 0,
          productivity: 0,
          accumulatedProductivity: 0,
          costToProductivityRatio: 0,
          combinedDate:
              breakdownType === 'year'
                  ? `${year}`
                  : breakdownType === 'quarter'
                      ? `${year}-Q${quarter}`
                      : `${year}-${month < 10 ? '0' + month : month}`,
        };
        accumulatedData.push(entry)
      }
      return entry
    }

    for (const cost of machineCosts) {
      const dateInfo = getDateInfo(new Date(cost.datePeriod))
      const entry = findOrCreateEntry(dateInfo.year, dateInfo.quarter, dateInfo.month)
      entry.accumulatedCost += cost.value
    }

    for (const workTime of machineProductivity) {
      const dateInfo = getDateInfo(new Date(workTime.datePeriod))
      const entry = findOrCreateEntry(dateInfo.year, dateInfo.quarter, dateInfo.month)
      entry.productivity += workTime.productivity
    }

    const startDate = new Date(dateStart)
    const endDate = new Date(dateEnd)

    while (startDate <= endDate) {
      const dateInfo = getDateInfo(startDate)
      findOrCreateEntry(dateInfo.year, dateInfo.quarter, dateInfo.month)

      if (breakdownType === 'year') {
        startDate.setFullYear(startDate.getFullYear() + 1)
      } else if (breakdownType === 'quarter') {
        startDate.setMonth(startDate.getMonth() + 3)
      } else {
        startDate.setMonth(startDate.getMonth() + 1)
      }
    }

    accumulatedData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (breakdownType === 'quarter') return (a.quarter || 0) - (b.quarter || 0);
      if (breakdownType === 'month') return (a.month || 0) - (b.month || 0);
      return 0;
    });

    let accumulatedCost = 0;
    let accumulatedProductivity = 0;

    for (const entry of accumulatedData) {
      accumulatedCost += entry.accumulatedCost
      accumulatedProductivity += entry.productivity

      entry.accumulatedProductivity = accumulatedProductivity

      entry.costToProductivityRatio =
          accumulatedProductivity > 0
              ? accumulatedCost / accumulatedProductivity
              : 0
    }

    const lastNonZeroEntry  = [...accumulatedData]
        .reverse()
        .find((entry) => entry.costToProductivityRatio > 0)

    const totalProductivity = lastNonZeroEntry
        ? lastNonZeroEntry.accumulatedProductivity
        : 0

    const specificCostRatio = totalProductivity > 0
        ? machineCost / totalProductivity
        : 0

    if (commissioningYear) {
      let commissioningEntry
      if (breakdownType === 'year') {
        commissioningEntry = accumulatedData.find(e => e.year === commissioningYear)
      } else if (breakdownType === 'quarter') {
        commissioningEntry = accumulatedData.find(
            e => e.year === commissioningYear && e.quarter === 1
        )
      } else {
        commissioningEntry = accumulatedData.find(
            (e) => e.year === commissioningYear && e.month === 1,
        )
      }

      if (commissioningEntry) {
        commissioningEntry.costToProductivityRatio += specificCostRatio
      } else {
        const newEntry = {
          year: commissioningYear,
          quarter: breakdownType === 'quarter' ? 1 : undefined,
          month: breakdownType === 'month' ? 1 : undefined,
          accumulatedCost: 0,
          productivity: 0,
          accumulatedProductivity: 0,
          costToProductivityRatio: specificCostRatio,
          combinedDate:
              breakdownType === 'year'
                  ? `${commissioningYear}`
                  : breakdownType === 'quarter'
                      ? `${commissioningYear}-Q1`
                      : `${commissioningYear}-01`,
        };
        accumulatedData.push(newEntry)
      }
    }

    if (accumulatedData.length === 0) {
      return []
    }

    const firstNonZeroIndex = accumulatedData.findIndex(e => e.costToProductivityRatio !== 0)
    const lastNonZeroIndex = accumulatedData.length > 0
        ? accumulatedData.slice().reverse().findIndex(e => e.costToProductivityRatio !== 0)
        : -1
    const lastIndex = lastNonZeroIndex !== -1
        ? accumulatedData.length - 1 - lastNonZeroIndex
        : -1

    if (firstNonZeroIndex === -1 || lastIndex === -1) return []

    const filteredItemData = accumulatedData.slice(firstNonZeroIndex, lastIndex + 1)

    return filteredItemData.map(({
      combinedDate,
      productivity,
      costToProductivityRatio
    }) => ({
      combinedDate,
      productivity,
      costToProductivityRatio,
    }));
  }

  async getDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement(
      user: User,
      data: IInputDataForDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement
  ) {
    try {
      const machines = await this.machineListService.filterMachines(
        user.organization.id,
        data.machineClassIds,
        data.machineMarkIds,
        data.machineTypeIds,
        data.machineIds,
        // data.dateStart,
        // data.dateEnd,
      );

      if (machines.length === 0) {
        throw new HttpException(
          'Данных по выбранному фильтру не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const machineIds = machines.map((machine) => machine.id);

      const costs = await this.costRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.machine', 'machine')
        .where('cost.machineId IN (:...machineIds)', { machineIds: machineIds })
        .andWhere('cost.isModel = false')
        .andWhere('cost.datePeriod BETWEEN DATE(:start) AND DATE(:end)', {
          start: data.dateStart,
          end: data.dateEnd,
        })
        .getMany();

      const productivity = await this.workTimeProductivityRepository
        .createQueryBuilder('workTimeProductivity')
        .leftJoinAndSelect('workTimeProductivity.machine', 'machine')
        .where('workTimeProductivity.machineId IN (:...machineIds)', {
          machineIds: machineIds,
        })
        .andWhere('workTimeProductivity.isModel = false')
        .andWhere(
          'workTimeProductivity.datePeriod BETWEEN DATE(:start) AND DATE(:end)',
          {
            start: data.dateStart,
            end: data.dateEnd,
          },
        )
        .getMany();

      const result = [];

      for (const machine of machines) {
        const machineData = await this.machineRepository.findOne({
          where: {
            id: machine.id,
          },
          relations: {
            machineType: {
              mark: true,
            },
          },
        });

        const machineResult = {
          machineId: machineData.id,
          markName: machineData.machineType.mark.name + '-' + machineData.machineType.name + '-' + machine.inventoryNumber,
          data: await this.calculateAccumulatedDataForMachine(
              machineData,
              costs,
              productivity,
              data.dateStart,
              data.dateEnd,
              data.breakdownType
          ),
        };

        result.push(machineResult);
      }

      const marksCalculation = await this.calculateForMarks(
        user,
        machines,
        data,
      );

      return [...result, ...marksCalculation];
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private async calculateForMarks(
    user: User,
    machines: Machine[],
    data: IInputDataForDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement,
  ) {
    const uniqueMarks = [
      ...new Set(machines.map((m) => m.machineType.mark.id)),
    ];

    const marksResults = [];

    for (const markId of uniqueMarks) {
      const markMachines = await this.machineRepository
        .createQueryBuilder('machine')
        .leftJoinAndSelect('machine.machineType', 'machineType')
        .leftJoinAndSelect('machineType.mark', 'mark')
        .where('mark.id = :markId', { markId })
        .andWhere('machine.organizationId = :organizationId', {
          organizationId: user.organization.id,
        })
        .getMany();

      const markCosts = await this.costRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.machine', 'machine')
        .where('machine.id IN (:...machineIds)', {
          machineIds: markMachines.map((m) => m.id),
        })
        .andWhere('cost.isModel = false')
        .andWhere('cost.datePeriod BETWEEN DATE(:start) AND DATE(:end)', {
          start: data.dateStart,
          end: data.dateEnd,
        })
        .getMany();

      const markProductivity = await this.workTimeProductivityRepository
        .createQueryBuilder('workTimeProductivity')
        .leftJoinAndSelect('workTimeProductivity.machine', 'machine')
        .where('machine.id IN (:...machineIds)', {
          machineIds: markMachines.map((m) => m.id),
        })
        .andWhere('workTimeProductivity.isModel = false')
        .andWhere(
          'workTimeProductivity.datePeriod BETWEEN DATE(:start) AND DATE(:end)',
          {
            start: data.dateStart,
            end: data.dateEnd,
          },
        )
        .getMany();

      const machinesData = [];
      for (const machine of markMachines) {
        const machineData = await this.calculateAccumulatedDataForMachine(
            machine,
            markCosts,
            markProductivity,
            data.dateStart,
            data.dateEnd,
            data.breakdownType
        );
        machinesData.push(machineData);
      }

      const yearToIndexMap = new Map<number, number>()
      let currentYearIndex = 1

      const getYearFromCombinedDate = (combinedDate: string): number | null => {
        const match = combinedDate.match(/^(\d{4})/)
        return match ? parseInt(match[1], 10) : null
      };

      const maxLength = Math.max(...machinesData.map(data => data.length));
      const result = Array(maxLength).fill(0).map(() => ({
        dataOperation: '',
        costToProductivityRatio: 0,
      }));

      for (const machineData of machinesData) {
        for (let i = 0; i < machineData.length; i++) {
          if (!result[i].dataOperation) {
            const combinedDate = machineData[i].combinedDate
            const year = getYearFromCombinedDate(combinedDate)

            if (year === null) {
              result[i].dataOperation = `${i + 1}`
            } else {
              let yearNumber: number
              if (yearToIndexMap.has(year)) {
                yearNumber = yearToIndexMap.get(year)
              } else {
                yearNumber = currentYearIndex++
                yearToIndexMap.set(year, yearNumber)
              }

              if (data.breakdownType === 'year') {
                result[i].dataOperation = `${yearNumber}`
              } else if (data.breakdownType === 'quarter') {
                const quarterMatch = combinedDate.match(/Q(\d)/)
                const quarter = quarterMatch ? quarterMatch[1] : '1'
                result[i].dataOperation = `${yearNumber}-Q${quarter}`
              } else if (data.breakdownType === 'month') {
                const monthMatch = combinedDate.match(/-(\d{1,2})$/)
                const month = monthMatch ? monthMatch[1] : '01'
                result[i].dataOperation = `${yearNumber}-${month.padStart(2, '0')}`
              }
            }
            result[i].costToProductivityRatio += machineData[i].costToProductivityRatio
          }
        }
      }

      for (const item of result) {
        item.costToProductivityRatio /= markMachines.length;
      }

      result.sort((a, b) => {
        const [yearStrA, periodA] = a.dataOperation.split('-');
        const [yearStrB, periodB] = b.dataOperation.split('-');

        const yearA = parseInt(yearStrA, 10);
        const yearB = parseInt(yearStrB, 10);
        //год
        if (yearA !== yearB) {
          return yearA - yearB;
        }

        if (!periodA && !periodB) return 0; // без периода
        if (!periodA) return -1; // a без периода
        if (!periodB) return 1;  // b без периода

        //квартал
        if (periodA.startsWith('Q') && periodB.startsWith('Q')) {
          const quarterA = parseInt(periodA.substring(1), 10);
          const quarterB = parseInt(periodB.substring(1), 10);
          return quarterA - quarterB;
        }

        //месяц
        const monthA = parseInt(periodA, 10);
        const monthB = parseInt(periodB, 10);
        return monthA - monthB;
      });

      marksResults.push({
        markId: markId,
        markName: markMachines[0].machineType.mark.name,
        data: result,
      });
    }

    return marksResults;
  }
}
