import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CTFRecord } from 'src/db/entities/ctf-records.entity';
import { MachinesService } from 'src/modules/machines/machines.service';
import { Between, In, Repository } from 'typeorm';

@Injectable()
export class CtfChartsService {
  constructor(
    @InjectRepository(CTFRecord) private readonly repo: Repository<CTFRecord>,
    private readonly machinesService: MachinesService,
  ) {}

  /**
   * Get the CTF structure data for the specified time range and categories.
   *
   * @param organizationId - The ID of the organization to get data for.
   * @param machineClassIds - The IDs of the machine classes to get data for.
   * @param machineTypeIds - The IDs of the machine types to get data for.
   * @param dateBegin - The start date of the range to get data for.
   * @param dateEnd - The end date of the range to get data for.
   * @returns An object containing the total, fact and calculated CTF data.
   */
  async getCtfStructureData(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ) {
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    const ctfRecords = await this.repo.find({
      where: {
        datePeriod: Between(startDate, endDate),
        machine: In(machines.map((m) => m.id)),
      },
      relations: {
        machine: true,
      },
    });

    if (ctfRecords.length === 0) {
      return {
        fact: {
          worktime_f: 0,
          plannedOaTD_f: 0,
          unplannedOaTD_f: 0,
          plannedRepair_f: 0,
          unplannedRepair_f: 0,
        },
        calculated: {
          worktime_c: 0,
          plannedOaTD_c: 0,
          unplannedOaTD_c: 0,
          plannedRepair_c: 0,
          unplannedRepair_c: 0,
        },
      };
    }

    // Суммирование данных за последний год
    const total = {
      fact: {
        worktime_f: 0,
        plannedOaTD_f: 0,
        unplannedOaTD_f: 0,
        plannedRepair_f: 0,
        unplannedRepair_f: 0,
      },
      calculated: {
        worktime_c: 0,
        plannedOaTD_c: 0,
        unplannedOaTD_c: 0,
        plannedRepair_c: 0,
        unplannedRepair_c: 0,
      },
    };

    for (const ctfRecord of ctfRecords) {
      total.fact.worktime_f += ctfRecord.worktime_f;
      total.calculated.worktime_c += ctfRecord.worktime_c;
      total.fact.plannedOaTD_f += ctfRecord.PlannedOaTD_f;
      total.calculated.plannedOaTD_c += ctfRecord.PlannedOaTD_c;
      total.fact.unplannedOaTD_f += ctfRecord.UnplannedOaTD_f;
      total.calculated.unplannedOaTD_c += ctfRecord.UnplannedOaTD_c;
      total.fact.plannedRepair_f +=
        ctfRecord.TM_f + ctfRecord.TR_f + ctfRecord.MR_f;
      total.calculated.plannedRepair_c +=
        ctfRecord.TM_c + ctfRecord.TR_c + ctfRecord.MR_c;
      total.fact.unplannedRepair_f += ctfRecord.UnplannedRepair_f;
      total.calculated.unplannedRepair_c += ctfRecord.UnplannedRepair_c;
    }

    // Корректировка данных для последнего года
    const year = endDate.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalHoursInYear = isLeapYear ? 8784 : 8760; // 8784 для високосных лет, 8760 для обычных

    const totalFactHours =
      total.fact.worktime_f +
      total.fact.plannedOaTD_f +
      total.fact.unplannedOaTD_f +
      total.fact.plannedRepair_f +
      total.fact.unplannedRepair_f;

    const totalCalculatedHours =
      total.calculated.worktime_c +
      total.calculated.plannedOaTD_c +
      total.calculated.unplannedOaTD_c +
      total.calculated.plannedRepair_c +
      total.calculated.unplannedRepair_c;

    const factAdjustmentFactor = totalHoursInYear / totalFactHours;
    const calculatedAdjustmentFactor = totalHoursInYear / totalCalculatedHours;

    // Корректировка фактических данных
    total.fact.worktime_f *= factAdjustmentFactor;
    total.fact.plannedOaTD_f *= factAdjustmentFactor;
    total.fact.unplannedOaTD_f *= factAdjustmentFactor;
    total.fact.plannedRepair_f *= factAdjustmentFactor;
    total.fact.unplannedRepair_f *= factAdjustmentFactor;

    // Корректировка плановых данных
    total.calculated.worktime_c *= calculatedAdjustmentFactor;
    total.calculated.plannedOaTD_c *= calculatedAdjustmentFactor;
    total.calculated.unplannedOaTD_c *= calculatedAdjustmentFactor;
    total.calculated.plannedRepair_c *= calculatedAdjustmentFactor;
    total.calculated.unplannedRepair_c *= calculatedAdjustmentFactor;

    return total;
  }

  /**
   * Get the CTF data grouped by years.
   *
   * Эта функция агрегирует данные CTF (время работы, простои и ремонты) по годам.
   * Она корректирует данные так, чтобы общее количество часов было одинаковым
   * для всех годов, кроме високосных (где добавляется 24 часа).
   *
   * @param organizationId - Идентификатор организации, для которой нужно получить данные.
   * @param machineClassIds - Идентификаторы классов машин для фильтрации.
   * @param machineMarkIds - Идентификаторы марок машин для фильтрации.
   * @param machineTypeIds - Идентификаторы типов машин для фильтрации.
   * @param machineIds - Идентификаторы конкретных машин для фильтрации.
   * @param startDate - Начальная дата диапазона для получения данных.
   * @param endDate - Конечная дата диапазона для получения данных.
   * @returns Массив объектов, содержащих данные CTF, сгруппированные по годам.
   */
  async getCtfDataByYear(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ) {
    // Получение списка машин, соответствующих заданным фильтрам
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Получение записей CTF из базы данных за указанный период
    const ctfRecords = await this.repo.find({
      where: {
        datePeriod: Between(startDate, endDate),
        machine: In(machines.map((m) => m.id)),
      },
      relations: {
        machine: true,
      },
    });

    // Инициализация структуры для хранения данных по годам
    const yearlyData: {
      year: number;
      fact: {
        label: string;
        worktime_f: number;
        plannedOaTD_f: number;
        unplannedOaTD_f: number;
        plannedRepair_f: number;
        unplannedRepair_f: number;
      };
      calculated: {
        label: string;
        worktime_c: number;
        plannedOaTD_c: number;
        unplannedOaTD_c: number;
        plannedRepair_c: number;
        unplannedRepair_c: number;
      };
    }[] = [];

    // Если записей CTF нет, создаём пустую структуру для каждого года в диапазоне
    if (ctfRecords.length === 0) {
      for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i++) {
        yearlyData.push({
          year: i,
          fact: {
            label: 'Факт',
            worktime_f: 0,
            plannedOaTD_f: 0,
            unplannedOaTD_f: 0,
            plannedRepair_f: 0,
            unplannedRepair_f: 0,
          },
          calculated: {
            label: 'План',
            worktime_c: 0,
            plannedOaTD_c: 0,
            unplannedOaTD_c: 0,
            plannedRepair_c: 0,
            unplannedRepair_c: 0,
          },
        });
      }
      return yearlyData;
    }

    // Агрегация данных CTF по годам
    for (const ctfRecord of ctfRecords) {
      const year = ctfRecord.datePeriod.getFullYear();

      // Если данные для года ещё не созданы, инициализируем их
      if (!yearlyData.find((d) => d.year === year)) {
        yearlyData.push({
          year: year,
          fact: {
            label: 'Факт',
            worktime_f: 0,
            plannedOaTD_f: 0,
            unplannedOaTD_f: 0,
            plannedRepair_f: 0,
            unplannedRepair_f: 0,
          },
          calculated: {
            label: 'План',
            worktime_c: 0,
            plannedOaTD_c: 0,
            unplannedOaTD_c: 0,
            plannedRepair_c: 0,
            unplannedRepair_c: 0,
          },
        });
      }

      // Находим данные для текущего года и добавляем значения
      const yearlyDataItem = yearlyData.find((d) => d.year === year);
      yearlyDataItem.fact.worktime_f += ctfRecord.worktime_f;
      yearlyDataItem.calculated.worktime_c += ctfRecord.worktime_c;
      yearlyDataItem.fact.plannedOaTD_f += ctfRecord.PlannedOaTD_f;
      yearlyDataItem.calculated.plannedOaTD_c += ctfRecord.PlannedOaTD_c;
      yearlyDataItem.fact.unplannedOaTD_f += ctfRecord.UnplannedOaTD_f;
      yearlyDataItem.calculated.unplannedOaTD_c += ctfRecord.UnplannedOaTD_c;
      yearlyDataItem.fact.plannedRepair_f +=
        ctfRecord.TM_f + ctfRecord.TR_f + ctfRecord.MR_f;
      yearlyDataItem.calculated.plannedRepair_c +=
        ctfRecord.TM_c + ctfRecord.TR_c + ctfRecord.MR_c;
      yearlyDataItem.calculated.unplannedRepair_c +=
        ctfRecord.UnplannedRepair_c;
      yearlyDataItem.fact.unplannedRepair_f += ctfRecord.UnplannedRepair_f;
    }

    // Корректировка данных для каждого года
    for (const yearData of yearlyData) {
      const year = yearData.year;
      const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const totalHoursInYear = isLeapYear ? 8784 : 8760; // 8784 для високосных лет, 8760 для обычных

      // Суммарное количество часов для фактических и плановых данных
      const totalFactHours =
        yearData.fact.worktime_f +
        yearData.fact.plannedOaTD_f +
        yearData.fact.unplannedOaTD_f +
        yearData.fact.plannedRepair_f +
        yearData.fact.unplannedRepair_f;

      const totalCalculatedHours =
        yearData.calculated.worktime_c +
        yearData.calculated.plannedOaTD_c +
        yearData.calculated.unplannedOaTD_c +
        yearData.calculated.plannedRepair_c +
        yearData.calculated.unplannedRepair_c;

      // Коэффициенты корректировки для фактических и плановых данных
      const factAdjustmentFactor = totalHoursInYear / totalFactHours;
      const calculatedAdjustmentFactor =
        totalHoursInYear / totalCalculatedHours;

      // Корректировка фактических данных
      yearData.fact.worktime_f *= factAdjustmentFactor;
      yearData.fact.plannedOaTD_f *= factAdjustmentFactor;
      yearData.fact.unplannedOaTD_f *= factAdjustmentFactor;
      yearData.fact.plannedRepair_f *= factAdjustmentFactor;
      yearData.fact.unplannedRepair_f *= factAdjustmentFactor;

      // Корректировка плановых данных
      yearData.calculated.worktime_c *= calculatedAdjustmentFactor;
      yearData.calculated.plannedOaTD_c *= calculatedAdjustmentFactor;
      yearData.calculated.unplannedOaTD_c *= calculatedAdjustmentFactor;
      yearData.calculated.plannedRepair_c *= calculatedAdjustmentFactor;
      yearData.calculated.unplannedRepair_c *= calculatedAdjustmentFactor;
    }

    // Сортировка данных по годам
    yearlyData.sort((a, b) => a.year - b.year);

    return yearlyData;
  }

  async getCtfWorktimeByServiceLife(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ) {
    // Получаем список машин, соответствующих заданным фильтрам
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Получаем записи CTF за указанный период
    const ctfRecords = await this.repo.find({
      where: {
        datePeriod: Between(startDate, endDate),
        machine: In(machines.map((m) => m.id)),
      },
      relations: {
        machine: true,
      },
    });

    // Если записей нет, возвращаем пустой массив
    if (ctfRecords.length === 0) {
      return [];
    }

    // Шаг 1: Агрегируем помесячные записи в годовые данные
    const yearlyData: {
      [key: string]: { worktime: number; count: number };
    } = {};

    for (const ctfRecord of ctfRecords) {
      const year = ctfRecord.datePeriod.getFullYear(); // Получаем год записи
      const serviceLife = year - ctfRecord.machine.dateEntry.getFullYear(); // Рассчитываем срок службы машины

      const key = `${serviceLife}-${year}`; // Уникальный ключ для срока службы и года

      // Если данных для данного ключа ещё нет, инициализируем их
      if (!yearlyData[key]) {
        yearlyData[key] = { worktime: 0, count: 0 };
      }

      // Суммируем время работы и увеличиваем счётчик записей
      yearlyData[key].worktime += ctfRecord.worktime_f;
      yearlyData[key].count++;
    }

    // Шаг 2: Агрегируем годовые данные по срокам службы
    const serviceLifeData: {
      serviceLife: number;
      worktime: number;
      worktimeAverage: number;
    }[] = [];

    const aggregatedByServiceLife: {
      [key: number]: { worktime: number; count: number };
    } = {};

    for (const key in yearlyData) {
      const [serviceLife] = key.split('-').map(Number); // Извлекаем срок службы из ключа

      // Если данных для данного срока службы ещё нет, инициализируем их
      if (!aggregatedByServiceLife[serviceLife]) {
        aggregatedByServiceLife[serviceLife] = { worktime: 0, count: 0 };
      }

      // Суммируем данные по времени работы и количеству записей
      aggregatedByServiceLife[serviceLife].worktime += yearlyData[key].worktime;
      aggregatedByServiceLife[serviceLife].count += yearlyData[key].count;
    }

    // Рассчитываем среднее время работы и добавляем данные в итоговый массив
    for (const serviceLife in aggregatedByServiceLife) {
      const { worktime, count } = aggregatedByServiceLife[serviceLife];
      serviceLifeData.push({
        serviceLife: Number(serviceLife),
        worktime: worktime / count, // Среднее время работы
        worktimeAverage: (worktime / count) * 1.15, // Увеличенное среднее время работы
      });
    }

    // Сортируем данные по сроку службы
    serviceLifeData.sort((a, b) => a.serviceLife - b.serviceLife);

    return serviceLifeData;
  }
}
