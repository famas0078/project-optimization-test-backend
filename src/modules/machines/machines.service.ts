import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Machine } from 'src/db/entities/machine.entity';
import { MachineClass } from 'src/db/entities/machine-class.entity';
import { DataSource, In, Repository, TreeRepository } from 'typeorm';

@Injectable()
export class MachinesService {
  /**
   * Constructor for the MachinesService.
   *
   * @param machinesRepo - Repository for accessing Machine entities
   * @param machineClassRepo - Repository for accessing MachineClass entities
   */
  constructor(
    @InjectRepository(Machine)
    private readonly machinesRepo: Repository<Machine>, // Repository for Machine entities
    @InjectDataSource() private readonly dataSource: DataSource, // Data source for the application
  ) {
    this.machineClassRepo = this.dataSource.getTreeRepository(MachineClass);
  }

  machineClassRepo: TreeRepository<MachineClass>;

  /**
   * Finds all machines for a given organization, machine class IDs, and machine type IDs.
   *
   * @param organizationId - Organization ID
   * @param machineClassIds - List of machine class IDs
   * @param machineMarkIds - List of machine mark IDs (optional)
   * @param machineTypeIds - List of machine type IDs (optional)
   * @param machineIds - List of machine IDs (optional)
   * @param dateEntryStart - Start date for filtering (optional)
   * @param dateEntryEnd - End date for filtering (optional)
   * @returns List of machines
   */
  async filterMachines(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds?: number[],
    machineTypeIds?: number[],
    machineIds?: number[],
    // dateEntryStart?: Date | null,
    // dateEntryEnd?: Date | null,
  ): Promise<Machine[]> {
    // Create the condition for filtering
    const whereCondition: any = {
      organization: { id: organizationId },
      machineType: {},
    };

    // Add arguments to the condition
    if (machineIds && machineIds?.length > 0) {
      // Add machine class IDs to the condition
      whereCondition.id = In(machineIds);
    } else if (machineTypeIds && machineTypeIds?.length > 0) {
      // Add machine type IDs to the condition
      whereCondition.machineType.id = In(machineTypeIds);
    } else if (machineMarkIds && machineMarkIds?.length > 0) {
      // Add machine mark IDs to the condition
      whereCondition.machineType.mark = {
        id: In(machineMarkIds),
      };
    } else if (machineClassIds && machineClassIds?.length > 0) {
      // Add machine class IDs to the condition
      const allMachineClassIds: number[] = [];

      for (const classId of machineClassIds) {
        const descendants = await this.machineClassRepo.findDescendants(
          await this.machineClassRepo.findOneBy({
            id: classId,
          }),
        );
        allMachineClassIds.push(classId, ...descendants.map((d) => d.id));
      }

      whereCondition.machineType.machineClass = {
        id: In(allMachineClassIds),
      };
    } else {
      return [];
    }

    // Add date entry range to the condition if provided
    // if (dateEntryStart && dateEntryEnd) {
    //   whereCondition.dateEntry = Between(dateEntryStart, dateEntryEnd);
    // }

    // Find machines with the given condition
    const result = await this.machinesRepo.find({
      where: whereCondition,
      relations: {
        machine2face: {
          face: true,
        },
        organization: true,
        machineType: {
          mark: true,
          machineClass: {
            parent: true,
          },
        },
      },
    });

    return result;
  }

  /**
   * Finds the earliest date of entry among a filtered list of machines based on the provided criteria.
   *
   * @param organizationId - The ID of the organization to which the machines belong.
   * @param machineClassIds - An array of machine class IDs to filter the machines.
   * @param machineMarkIds - (Optional) An array of machine mark IDs to further filter the machines.
   * @param machineTypeIds - (Optional) An array of machine type IDs to further filter the machines.
   * @param machineIds - (Optional) An array of specific machine IDs to further filter the machines.
   * @returns A promise that resolves to the earliest date of entry (`Date`) among the filtered machines,
   *          or `null` if no machines match the criteria.
   */
  async findEarliestMachineEntryDate(
    organizationId: number,
    machineClassIds: number[],
    machineMarkIds?: number[],
    machineTypeIds?: number[],
    machineIds?: number[],
  ): Promise<Date | null> {
    // Filter machines based on the provided criteria
    const machines = await this.filterMachines(
      organizationId,
      machineClassIds,
      machineMarkIds,
      machineTypeIds,
      machineIds,
    );

    // If no machines match the criteria, return null
    if (machines.length === 0) {
      return null;
    }

    // Find the machine with the earliest dateEntry
    const earliestDate = machines.reduce((prevMachine, currentMachine) => {
      // If prevMachine is null, set it to the currentMachine
      if (
        !prevMachine ||
        (currentMachine.dateEntry &&
          currentMachine.dateEntry < prevMachine.dateEntry)
      ) {
        return currentMachine;
      }
      return prevMachine;
    }, null);

    // Return the earliest dateEntry or null if none exists
    return earliestDate.dateEntry;
  }
}
