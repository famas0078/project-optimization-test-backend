import { Injectable } from '@nestjs/common';
import { MachinesService } from '../../machines/machines.service';

/**
 * A simple object that represents data for a bar chart.
 * @property year - The year of the data point
 * @property count - The count of machines for the given year
 */
export interface ChartData {
  /**
   * The year of the data point
   */
  year: number;
  /**
   * The count of machines for the given year
   */
  count: number;
}

/**
 * An object that represents the cumulative count of machines
 * for each year in a range.
 * @property year - The year of the data point
 * @property main - The cumulative count of main machines
 * @property auxiliary - The cumulative count of auxiliary machines
 */
export interface CumulativeMachineCount {
  /**
   * The year of the data point
   */
  year: number;
  /**
   * The cumulative count of main machines
   */
  main: number;
  /**
   * The cumulative count of auxiliary machines
   */
  auxiliary: number;
}

/**
 * An object that represents the average age of machines for each year.
 * @property year - The year of the data point
 * @property main - The average age of main machines
 * @property auxiliary - The average age of auxiliary machines
 */
export interface AverageMachineAge {
  /**
   * The year of the data point
   */
  year: number;
  /**
   * The average age of main machines
   */
  main: number;
  /**
   * The average age of auxiliary machines
   */
  auxiliary: number;
}

/**
 * An object that represents the count and average age of machines for each year.
 * @property year - The year of the data point
 * @property mainCount - The count of main machines
 * @property auxiliaryCount - The count of auxiliary machines
 * @property mainAvgAge - The average age of main machines
 * @property auxiliaryAvgAge - The average age of auxiliary machines
 */
export interface MachineCountAndAverageAge {
  /**
   * The count of main machines
   */
  mainCount: number;
  /**
   * The count of auxiliary machines
   */
  auxiliaryCount: number;
  /**
   * The average age of main machines
   */
  mainAvgAge: number;
  /**
   * The average age of auxiliary machines
   */
  auxiliaryAvgAge: number;
}

/**
 * An object that represents the distribution of machines by work type for a given year.
 * @property workType - The type of work (e.g., Main, Auxiliary)
 * @property count - The count of machines for the given work type
 */
export interface MachineWorkDistribution {
  /**
   * The type of work (e.g., Main, Auxiliary)
   */
  workType: string;
  /**
   * The count of machines for the given work type
   */
  count: number;
}

@Injectable()
export class ActivesChartsService {
  /**
   * Constructor for the ChartsService.
   *
   * @param machinesService - The service that provides the machine list.
   */
  constructor(private readonly machinesService: MachinesService) {}

  /**
   * Gets data for a bar chart that shows the number of machines of each year.
   * @param organizationId The ID of the organization.
   * @param machineClassIds The IDs of the machine classes.
   * @param machineTypeIds The IDs of the machine types.
   * @param startYear The start year of the range.
   * @param endYear The end year of the range.
   * @returns A list of objects that contain the year and the count of machines for that year.
   */
  async getMachineCountByYear(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<ChartData[]> {
    // Get the list of machines in the specified year range
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Create an object to count the machines by year
    const yearCountMap: Record<number, number> = {};

    // Initialize the years in the range
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      yearCountMap[year] = 0;
    }

    // Increase the counter for each year based on the list of machines
    for (const machine of machines) {
      const year = machine.dateEntry.getFullYear();
      if (yearCountMap[year] !== undefined) {
        yearCountMap[year]++;
      }
    }

    // Transform the data into a format for the chart
    const chartData = Object.entries(yearCountMap).map(([year, count]) => ({
      year: parseInt(year, 10),
      count,
    }));

    return chartData;
  }

  /**
   * Gets data for a bar chart that shows the distribution of machine work types for the current year.
   * @param organizationId The ID of the organization.
   * @param startYear The start year of the range.
   * @param endYear The end year of the range.
   * @param machineClassIds The IDs of the machine classes.
   * @param machineTypeIds The IDs of the machine types.
   * @returns A list of objects containing the type of work and the count of machines for that work type.
   */
  async getMachineWorkDistribution(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    // startDate: Date,
    // endDate: Date,
  ): Promise<MachineWorkDistribution[]> {
    // Fetch machines within the specified year range
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Initialize counts for each type of work
    const workCounts: {
      mining: number;
      overburden: number;
      additional: number;
    } = {
      mining: 0,
      overburden: 0,
      additional: 0,
    };

    // Categorize machines by their work type
    for (const machine of machines) {
      const machineWorkType = machine.machine2face?.face.zoneWorking;
      switch (machineWorkType) {
        case 'Добыча':
          workCounts.mining++;
          break;
        case 'Вскрыша':
          workCounts.overburden++;
          break;
        default:
          workCounts.additional++;
          break;
      }
    }

    // Transform the work counts into the final data format
    const workDistribution: MachineWorkDistribution[] = [
      { workType: 'Добычные работы', count: workCounts.mining },
      { workType: 'Вскрышные работы', count: workCounts.overburden },
      { workType: 'Дополнительные работы', count: workCounts.additional },
    ];

    return workDistribution;
  }

  /**
   * Calculates the cumulative count of machines by year and category.
   *
   * @param organizationId The ID of the organization.
   * @param machineClassIds The IDs of the machine classes.
   * @param machineMarkIds The IDs of the machine marks.
   * @param machineTypeIds The IDs of the machine types.
   * @param machineIds The IDs of the machines.
   * @param startDate The start date of the range.
   * @param endDate The end date of the range.
   * @returns A list of objects containing the year and cumulative counts of main and auxiliary machines.
   */
  async getCumulativeMachineCountByYear(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<CumulativeMachineCount[]> {
    // Fetch machines within the specified year range
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Initialize a record to keep track of counts by year
    const cumulativeCounts: Record<
      number,
      { main: number; auxiliary: number }
    > = {};

    // Initialize cumulative counts for each year in the range
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      cumulativeCounts[year] = { main: 0, auxiliary: 0 };
    }

    // Categorize machines based on their class and year
    for (const machine of machines) {
      const year = machine.dateEntry.getFullYear();
      const machineClassId = machine.machineType.machineClass.parent.id;

      if (year >= startDate.getFullYear() && year <= endDate.getFullYear()) {
        switch (machineClassId) {
          case 2: // Main equipment
            cumulativeCounts[year].main++;
            break;
          case 3: // auxiliary equipment
            cumulativeCounts[year].auxiliary++;
            break;
        }
      }
    }

    // Calculate cumulative totals over the years
    let cumulativeMain = 0;
    let cumulativeAuxiliary = 0;
    let cumulativeSummary = 0;

    // Transform the cumulative counts into the final chart data format
    const chartData = Object.entries(cumulativeCounts).map(([year, counts]) => {
      cumulativeMain += counts.main;
      cumulativeAuxiliary += counts.auxiliary;
      cumulativeSummary = cumulativeMain + cumulativeAuxiliary;

      return {
        year: parseInt(year, 10),
        main: cumulativeMain,
        auxiliary: cumulativeAuxiliary,
        sum: cumulativeSummary,
      };
    });

    return chartData;
  }

  /**
   * Calculates the average age of machines by year and category.
   *
   * @param organizationId The ID of the organization.
   * @param machineClassIds The IDs of the machine classes.
   * @param machineMarkIds The IDs of the machine marks.
   * @param machineTypeIds The IDs of the machine types.
   * @param machineIds The IDs of the machines.
   * @param startDate The start date of the range.
   * @param endDate The end date of the range.
   * @returns A list of objects containing the year and average age of main and auxiliary machines.
   */
  async getAverageMachineAgeByYear(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<AverageMachineAge[]> {
    // Fetch machines within the specified year range
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Initialize a record to keep track of machine ages by year and category
    const yearAgeMap: Record<
      number,
      {
        main: { totalAge: number; count: number };
        auxiliary: { totalAge: number; count: number };
      }
    > = {};

    // Initialize total age and count for each year in the range
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      yearAgeMap[year] = {
        main: { totalAge: 0, count: 0 },
        auxiliary: { totalAge: 0, count: 0 },
      };
    }

    // Calculate the age of each machine for each year in the range
    for (const machine of machines) {
      const monthOfManufacture = machine.dateEntry.getMonth();
      const manufactureYear = machine.dateEntry.getFullYear();
      const machineClassId = machine.machineType.machineClass.parent.id;

      for (
        let year = startDate.getFullYear();
        year <= endDate.getFullYear();
        year++
      ) {
        if (manufactureYear <= year) {
          const age = (12 - monthOfManufacture) / 12 + year - manufactureYear;
          switch (machineClassId) {
            case 2: // Main equipment
              yearAgeMap[year].main.totalAge += age;
              yearAgeMap[year].main.count++;
              break;
            case 3: // auxiliary equipment
              yearAgeMap[year].auxiliary.totalAge += age;
              yearAgeMap[year].auxiliary.count++;
              break;
          }
        }
      }
    }

    // Calculate the average age for each year and category
    const averageAgeData = Object.entries(yearAgeMap).map(
      ([year, { main, auxiliary }]) => ({
        year: parseInt(year, 10),
        main: main.count > 0 ? main.totalAge / main.count : 0,
        auxiliary:
          auxiliary.count > 0 ? auxiliary.totalAge / auxiliary.count : 0,
      }),
    );

    return averageAgeData;
  }

  /**
   * Gets the count and average age of machines by year and category.
   *
   * @param organizationId The ID of the organization.
   * @param machineClassIds The IDs of the machine classes.
   * @param machineTypeIds The IDs of the machine types.
   * @param startYear The start year of the range.
   * @param endYear The end year of the range.
   * @returns An object containing the year, count of machines, and average age of machines by category.
   */
  async getMachineCountAndAverageAgeByYear(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds: number[],
    machineTypeIds: number[],
    machineIds: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<MachineCountAndAverageAge> {
    // Fetch machines within the specified year range
    const machines = await this.machinesService.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
      // startDate,
      // endDate,
    );

    // Initialize a record to keep track of machine counts and ages by year and category
    const yearDataMap: Record<
      number,
      {
        main: { count: number; totalAge: number };
        auxiliary: { count: number; totalAge: number };
      }
    > = {};

    // Initialize data for each year in the range
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      yearDataMap[year] = {
        main: { count: 0, totalAge: 0 },
        auxiliary: { count: 0, totalAge: 0 },
      };
    }

    // Calculate the count and total age of each machine for each year in the range
    for (const machine of machines) {
      const manufactureYear = machine.dateEntry.getFullYear();
      const machineClassId = machine.machineType.machineClass.parent.id;

      for (
        let year = startDate.getFullYear();
        year <= endDate.getFullYear();
        year++
      ) {
        if (manufactureYear <= year) {
          const age = year - manufactureYear;
          switch (machineClassId) {
            case 2: // Main equipment
              yearDataMap[year].main.count++;
              yearDataMap[year].main.totalAge += age;
              break;
            case 3: // auxiliary equipment
              yearDataMap[year].auxiliary.count++;
              yearDataMap[year].auxiliary.totalAge += age;
              break;
          }
        }
      }
    }

    // Calculate the average age and find the result for the last year directly
    const lastYearData = yearDataMap[endDate.getFullYear()];
    return {
      mainCount: lastYearData.main.count,
      auxiliaryCount: lastYearData.auxiliary.count,
      mainAvgAge:
        lastYearData.main.count > 0
          ? lastYearData.main.totalAge / lastYearData.main.count
          : 0,
      auxiliaryAvgAge:
        lastYearData.auxiliary.count > 0
          ? lastYearData.auxiliary.totalAge / lastYearData.auxiliary.count
          : 0,
    };
  }
}
