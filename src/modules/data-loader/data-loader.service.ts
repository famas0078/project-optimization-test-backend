import { Injectable, Logger } from '@nestjs/common';
import * as iconv from 'iconv-lite';
import { Breakdown } from 'src/db/entities/breakdown.entity';
import { Cost } from 'src/db/entities/cost.entity';
import { CostsKind } from 'src/db/entities/costs-kind.entity';
import { CTFRecord } from 'src/db/entities/ctf-records.entity';
import { Face } from 'src/db/entities/face.entity';
import { Fault } from 'src/db/entities/fault.entity';
import { MachineClass } from 'src/db/entities/machine-class.entity';
import { MachineMark } from 'src/db/entities/machine-mark.entity';
import { MachinePart } from 'src/db/entities/machine-part.entity';
import { MachineType } from 'src/db/entities/machine-type.entity';
import { Machine } from 'src/db/entities/machine.entity';
import { Machine2Face } from 'src/db/entities/machine2face.entity';
import { Machine2Strategy } from 'src/db/entities/machine2strategy.entity';
import { MroStrategy } from 'src/db/entities/mro-strategy.entity';
import { Organization } from 'src/db/entities/organization.entity';
import { WorkTimeProductivity } from 'src/db/entities/work-time-productivity.entity';

@Injectable()
export class DataLoaderService {
  constructor() {}

  private logger = new Logger(DataLoaderService.name, { timestamp: true });

  private readAndParseCSV(file: Express.Multer.File): { [key: string]: any }[] {
    // transform to UTF-8 and delete \r from CSV
    const utf8 = iconv
      .decode(file.buffer, 'win1251', {
        defaultEncoding: 'utf8',
      })
      .replace(/\r/g, '');

    // get list of headers from CSV
    const headers = utf8.split('\n')[0].split(';');

    // Parse text from CSV by headers into array of objects
    const data = utf8
      .split('\n')
      .slice(1)
      .map((line: string) => {
        // split line by ';' and create object with headers as keys
        const values = line.split(';');
        // return object with headers as keys and trimmed values
        return headers.reduce((acc, header, index) => {
          acc[header.trim()] = values[index]?.trim();
          return acc;
        }, {});
      });

    // return parsed data
    return data;
  }

  private parseAndTransformTechSpecData(techSpecDataCSV: Express.Multer.File) {
    return this.readAndParseCSV(techSpecDataCSV)
      .filter((item) => item['orgName'])
      .map((item) => {
        item['date_change'] = new Date(
          item['date_change'].replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'),
        );
        item['dateentry'] = new Date(
          item['dateentry'].replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'),
        );
        if (item['price']) {
          item['price'] = Number(item['price'].replace(',', '.'));
        }
        item['priceperiod'] = Number(item['priceperiod']);
        item['techPerformance'] = Number(item['techPerformance']);
        item['fuelConsumption'] = Number(item['fuelConsumption']);
        item['averageSpeed'] = Number(item['averageSpeed']);
        item['isnew'] = item['isNew'] === 't';
        return item;
      });
  }

  private parseAndTransformWorkTimeProductivityData(
    workTimeProductivityDataCSV: Express.Multer.File,
  ) {
    return this.readAndParseCSV(workTimeProductivityDataCSV)
      .filter((item) => item['orgName'])
      .map((item) => {
        item['dateperiod'] = new Date(
          item['dateperiod'].replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'),
        );
        item['productivity'] = Number(item['productivity'].replace(',', '.'));
        item['CTF_f'] = Number(item['CTF_f'].replace(',', '.'));
        item['CTF_с'] = Number(item['CTF_с'].replace(',', '.'));
        item['worktime_f'] = Number(item['worktime_f'].replace(',', '.'));
        item['worktime_c'] = Number(item['worktime_c'].replace(',', '.'));
        item['PlannedOaTD_f'] = Number(item['PlannedOaTD_f'].replace(',', '.'));
        item['PlannedOaTD_c'] = Number(item['PlannedOaTD_c'].replace(',', '.'));
        item['UnplannedOaTD_f'] = Number(
          item['UnplannedOaTD_f'].replace(',', '.'),
        );
        item['UnplannedOaTD_c'] = Number(
          item['UnplannedOaTD_c'].replace(',', '.'),
        );
        item['PlannedRepair_f'] = Number(
          item['PlannedRepair_f'].replace(',', '.'),
        );
        item['PlannedRepair_c'] = Number(
          item['PlannedRepair_c'].replace(',', '.'),
        );
        item['UnplannedRepair_f'] = Number(
          item['UnplannedRepair_f'].replace(',', '.'),
        );
        item['UnplannedRepair_c'] = Number(
          item['UnplannedRepair_c'].replace(',', '.'),
        );
        delete item['TM_f'];
        delete item['TR_f'];
        delete item['MR_f'];
        delete item['TM_c'];
        delete item['TR_c'];
        delete item['MR_c'];
        return item;
      });
  }

  private parseAndTransformCostsData(costsDataCSV: Express.Multer.File) {
    return this.readAndParseCSV(costsDataCSV)
      .filter((item) => item['orgName'])
      .map((item) => {
        item['dateperiod'] = new Date(
          item['dateperiod'].replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'),
        );
        item['value_f'] = Number(item['value_f'].replace(',', '.'));
        item['value_c'] = Number(item['value_c'].replace(',', '.'));
        return item;
      });
  }

  private parseAndTransformBreakdownsData(
    breakdownsDataCSV: Express.Multer.File,
  ) {
    return this.readAndParseCSV(breakdownsDataCSV)
      .filter((item) => item['orgName'])
      .map((item) => {
        // console.log(
        //   `datestartFault до преобразования: '${item['datestartFault']}'`,
        // );
        // console.log(
        //   `dateendFault до преобразования: '${item['dateendFault']}'`,
        // );

        item['datestartFault'] = new Date(
          item['datestartFault'].replace(
            /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/,
            '$3-$2-$1T$4:$5:00',
          ),
        );
        item['dateendFault'] = new Date(
          item['dateendFault'].replace(
            /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/,
            '$3-$2-$1T$4:$5:00',
          ),
        );
        item['isfull_failure'] = item['isfull_failure'] === 't';
        item['wait_time'] = Number(item['wait_time']);
        item['repair_time'] = Number(item['repair_time']);
        return item;
      });
  }

  private async insertIntoMachineMarks(techSpecData: { [key: string]: any }[]) {
    this.logger.log('Inserting into machine marks table');
    const machineMarks: { [key: string]: MachineMark } = {};

    for (const item of techSpecData) {
      const markLabel = item['machinename'].split('_', 1)[0];

      if (!machineMarks[markLabel]) {
        let mark: MachineMark;

        const existingMark = await MachineMark.findOneBy({
          name: markLabel,
        });

        if (existingMark != null) {
          existingMark.name = markLabel;
          mark = existingMark;
        } else {
          mark = MachineMark.create({
            name: markLabel,
          });
        }

        machineMarks[markLabel] = mark;
      }
    }

    try {
      await Promise.all(
        Object.values(machineMarks).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Machine marks inserted');
  }

  private async insertIntoMachineTypesTable(
    techSpecData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into machine types table');
    const machineClasses: { [key: string]: MachineClass } = {};
    (await MachineClass.find()).map((item) => {
      machineClasses[item.name] = item;
    });

    const machineTypes: { [key: string]: MachineType } = {};

    for (const item of techSpecData) {
      if (!machineTypes[`${item['machinename']}_${item['orgName']}`]) {
        let machineType: MachineType;

        const existingMachineType = await MachineType.findOneBy({
          mark: await MachineMark.findOneBy({
            name: item['machinename'].split('_', 1)[0],
          }),
          name: item['machinename'].replace(
            item['machinename'].split('_', 1) + '_',
            '',
          ),
          organization: await Organization.findOneBy({ name: item['orgName'] }),
        });

        if (existingMachineType != null) {
          existingMachineType.mark = await MachineMark.findOneBy({
            name: item['machinename'].split('_', 1)[0],
          });
          existingMachineType.name = item['machinename'].replace(
            item['machinename'].split('_', 1) + '_',
            '',
          );
          existingMachineType.machineClass =
            machineClasses[item['machinetype']];
          existingMachineType.engine = item['engine'];
          existingMachineType.organization = await Organization.findOneBy({
            name: item['orgName'],
          });
          machineType = existingMachineType;
        } else {
          machineType = MachineType.create({
            mark: await MachineMark.findOneBy({
              name: item['machinename'].split('_', 1)[0],
            }),
            name: item['machinename'].replace(
              item['machinename'].split('_', 1) + '_',
              '',
            ),
            machineClass: machineClasses[item['machinetype']],
            engine: item['engine'],
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
        }

        machineTypes[`${item['machinename']}_${item['orgName']}`] = machineType;
      }
    }
    try {
      await Promise.all(
        Object.values(machineTypes).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Machine types inserted');
  }

  private async insertIntoOrganizationsTable(
    techSpecData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into organizations table');
    const organizations: { [key: string]: Organization } = {};

    for (const item of techSpecData) {
      if (!organizations[`${item['orgName']}_${item['department']}`]) {
        let organization: Organization;

        const existingOrganization = await Organization.findOneBy({
          name: item['orgName'],
          department: item['department'],
        });

        if (existingOrganization != null) {
          existingOrganization.name = item['orgName'];
          existingOrganization.department = item['department'];
          organization = existingOrganization;
        } else {
          organization = Organization.create({
            name: item['orgName'],
            department: item['department'],
          });
        }

        organizations[item['orgName']] = organization;
      }
    }

    try {
      await Promise.all(
        Object.values(organizations).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Organizations inserted');
  }

  private async insertIntoMachinesTable(
    techSpecData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into machines table');
    const machines: { [key: string]: Machine } = {};

    for (const item of techSpecData) {
      if (
        !machines[
          `${item['orgName']}_${item['machinename']}_${item['inventorynumber']}`
        ]
      ) {
        let machine: Machine;

        const existingMachine = await Machine.findOneBy({
          machineType: await MachineType.findOneBy({
            mark: await MachineMark.findOneBy({
              name: item['machinename'].split('_', 1)[0],
            }),
            name: item['machinename'].replace(
              item['machinename'].split('_', 1) + '_',
              '',
            ),
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          }),
          organization: await Organization.findOneBy({
            name: item['orgName'],
            department: item['department'],
          }),
          inventoryNumber: item['inventorynumber'],
        });

        if (existingMachine != null) {
          existingMachine.machineType = await MachineType.findOneBy({
            mark: await MachineMark.findOneBy({
              name: item['machinename'].split('_', 1)[0],
            }),
            name: item['machinename'].replace(
              item['machinename'].split('_', 1) + '_',
              '',
            ),
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
          existingMachine.organization = await Organization.findOneBy({
            name: item['orgName'],
            department: item['department'],
          });
          existingMachine.inventoryNumber = item['inventorynumber'];
          existingMachine.dateEntry = item['dateentry'];
          existingMachine.price = item['price'];
          existingMachine.pricePeriod = item['priceperiod'];
          existingMachine.isNew = item['isnew'];
          machine = existingMachine;
        } else {
          machine = Machine.create({
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            organization: await Organization.findOneBy({
              name: item['orgName'],
              department: item['department'],
            }),
            inventoryNumber: item['inventorynumber'],
            dateEntry: item['dateentry'],
            price: item['price'],
            pricePeriod: item['priceperiod'],
            isNew: item['isnew'],
          });
        }

        machines[
          `${item['orgName']}_${item['machinename']}_${item['inventorynumber']}`
        ] = machine;
      }
    }

    try {
      await Promise.all(
        Object.values(machines).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Machines inserted');
  }

  private async insertIntoFacesTable(
    workTimeProductivityData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into faces table');
    const faces: { [key: string]: Face } = {};

    for (const item of workTimeProductivityData) {
      if (
        !faces[`${item['orgName']}_${item['faceName']}_${item['zoneWorking']}`]
      ) {
        let face: Face;

        const existingFace = await Face.findOneBy({
          name: item['faceName'],
          zoneWorking: item['zoneWorking'],
          organization: await Organization.findOneBy({ name: item['orgName'] }),
        });

        if (existingFace != null) {
          existingFace.name = item['faceName'];
          existingFace.zoneWorking = item['zoneWorking'];
          existingFace.organization = await Organization.findOneBy({
            name: item['orgName'],
          });
          face = existingFace;
        } else {
          face = Face.create({
            name: item['faceName'],
            zoneWorking: item['zoneWorking'],
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
        }

        faces[`${item['orgName']}_${item['faceName']}_${item['zoneWorking']}`] =
          face;
      }
    }

    try {
      await Promise.all(
        Object.values(faces).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Faces inserted');
  }

  private async insertIntoMachine2FaceTable(
    workTimeProductivityData: { [key: string]: any }[],
    techSpecData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into machine2faces table');
    const machine2faces: { [key: string]: Machine2Face } = {};

    for (const item of workTimeProductivityData) {
      if (
        !machine2faces[
          `${item['orgName']}_${item['faceName']}_${item['zoneWorking']}_${item['machinename']}_${item['inventorynumber']}_${item['dateChange']}`
        ]
      ) {
        let machine2face: Machine2Face;

        const existingMachine2Face = await Machine2Face.findOneBy({
          machine: await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          }),
          face: await Face.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            name: item['faceName'],
            zoneWorking: item['zoneWorking'],
          }),
          dateChange: item['dateChange'],
        });

        if (existingMachine2Face != null) {
          existingMachine2Face.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          });
          existingMachine2Face.face = await Face.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            name: item['faceName'],
            zoneWorking: item['zoneWorking'],
          });
          existingMachine2Face.machinePerformance = techSpecData.find(
            (techSpecItem) =>
              techSpecItem['machinename'] === item['machinename'] &&
              techSpecItem['inventorynumber'] === item['inventorynumber'] &&
              techSpecItem['orgName'] === item['orgName'],
          )?.['techPerformance'];
          existingMachine2Face.fuelConsumption = techSpecData.find(
            (techSpecItem) =>
              techSpecItem['machinename'] === item['machinename'] &&
              techSpecItem['inventorynumber'] === item['inventorynumber'] &&
              techSpecItem['orgName'] === item['orgName'],
          )?.['fuelConsumption'];
          existingMachine2Face.averageSpeed = techSpecData.find(
            (techSpecItem) =>
              techSpecItem['machinename'] === item['machinename'] &&
              techSpecItem['inventorynumber'] === item['inventorynumber'] &&
              techSpecItem['orgName'] === item['orgName'],
          )?.['averageSpeed'];
          existingMachine2Face.dateChange = techSpecData.find(
            (techSpecItem) =>
              techSpecItem['machinename'] === item['machinename'] &&
              techSpecItem['inventorynumber'] === item['inventorynumber'] &&
              techSpecItem['orgName'] === item['orgName'],
          )?.['date_change'];
          machine2face = existingMachine2Face;
        } else {
          machine2face = Machine2Face.create({
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
              inventoryNumber: item['inventorynumber'],
            }),
            face: await Face.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              name: item['faceName'],
              zoneWorking: item['zoneWorking'],
            }),
            machinePerformance: techSpecData.find(
              (techSpecItem) =>
                techSpecItem['machinename'] === item['machinename'] &&
                techSpecItem['inventorynumber'] === item['inventorynumber'] &&
                techSpecItem['orgName'] === item['orgName'],
            )?.['techPerformance'],
            fuelConsumption: techSpecData.find(
              (techSpecItem) =>
                techSpecItem['machinename'] === item['machinename'] &&
                techSpecItem['inventorynumber'] === item['inventorynumber'] &&
                techSpecItem['orgName'] === item['orgName'],
            )?.['fuelConsumption'],
            averageSpeed: techSpecData.find(
              (techSpecItem) =>
                techSpecItem['machinename'] === item['machinename'] &&
                techSpecItem['inventorynumber'] === item['inventorynumber'] &&
                techSpecItem['orgName'] === item['orgName'],
            )?.['averageSpeed'],
            dateChange: techSpecData.find(
              (techSpecItem) =>
                techSpecItem['machinename'] === item['machinename'] &&
                techSpecItem['inventorynumber'] === item['inventorynumber'] &&
                techSpecItem['orgName'] === item['orgName'],
            )?.['date_change'],
          });
        }

        if (machine2face.dateChange == null) {
          continue;
        }

        machine2faces[
          `${item['orgName']}_${item['faceName']}_${item['zoneWorking']}_${item['machinename']}_${item['inventorynumber']}_${item['dateChange']}`
        ] = machine2face;
      }
    }

    try {
      await Promise.all(
        Object.values(machine2faces).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Machine2faces inserted');
  }

  private async insertIntoMroStrategiesTable(
    workTimeProductivityData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into MRO strategies table');
    const mroStrategies: { [key: string]: MroStrategy } = {};

    for (const item of workTimeProductivityData) {
      if (!mroStrategies[`${item['orgName']}_${item['strategyname']}`]) {
        let mroStrategy: MroStrategy;

        const existingMroStrategy = await MroStrategy.findOneBy({
          name: item['strategyname'],
          organization: await Organization.findOneBy({ name: item['orgName'] }),
        });

        if (existingMroStrategy != null) {
          existingMroStrategy.name = item['strategyname'];
          existingMroStrategy.workBeginYear = true;
          existingMroStrategy.organization = await Organization.findOneBy({
            name: item['orgName'],
          });
          mroStrategy = existingMroStrategy;
        } else {
          mroStrategy = MroStrategy.create({
            name: item['strategyname'],
            workBeginYear: true,
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
        }

        mroStrategies[item['strategyname']] = mroStrategy;
      }
    }

    try {
      await Promise.all(
        Object.values(mroStrategies).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('MRO strategies inserted');
  }

  private async insertIntoMachine2StrategyTable(
    workTimeProductivityData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into machine2strategies table');
    const machine2strategies: { [key: string]: Machine2Strategy } = {};

    for (const item of workTimeProductivityData) {
      if (
        !machine2strategies[
          `${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}`
        ]
      ) {
        let machine2strategy: Machine2Strategy;

        const existingMachine2Strategy = await Machine2Strategy.findOneBy({
          machine: await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          }),
          strategy: await MroStrategy.findOneBy({ name: item['strategyname'] }),
        });

        if (existingMachine2Strategy != null) {
          existingMachine2Strategy.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          });
          existingMachine2Strategy.strategy = await MroStrategy.findOneBy({
            name: item['strategyname'],
          });
          machine2strategy = existingMachine2Strategy;
        } else {
          machine2strategy = Machine2Strategy.create({
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
              inventoryNumber: item['inventorynumber'],
            }),
            strategy: await MroStrategy.findOneBy({
              name: item['strategyname'],
            }),
          });
        }

        machine2strategies[
          `${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}`
        ] = machine2strategy;
      }
    }

    try {
      await Promise.all(
        Object.values(machine2strategies).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Machine2strategies inserted');
  }

  private async insertIntoWorkTimeProductivityTable(
    workTimeProductivityData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into work time productivity table');
    const workTimeProductivities: { [key: string]: WorkTimeProductivity } = {};

    for (const item of workTimeProductivityData) {
      if (
        !workTimeProductivities[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}`
        ]
      ) {
        let workTimeProductivity: WorkTimeProductivity;

        const existingWorkTimeProductivity =
          await WorkTimeProductivity.findOneBy({
            datePeriod: item['dateperiod'],
            strategy: await MroStrategy.findOneBy({
              name: item['strategyname'],
            }),
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
              inventoryNumber: item['inventorynumber'],
            }),
          });

        if (existingWorkTimeProductivity != null) {
          existingWorkTimeProductivity.datePeriod = item['dateperiod'];
          existingWorkTimeProductivity.strategy = await MroStrategy.findOneBy({
            name: item['strategyname'],
          });
          existingWorkTimeProductivity.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          });
          existingWorkTimeProductivity.productivity = item['productivity'];
          existingWorkTimeProductivity.isModel = item['isModel'] === 't';
          existingWorkTimeProductivity.workTime = item['worktime_f'];
          workTimeProductivity = existingWorkTimeProductivity;
        } else {
          workTimeProductivity = WorkTimeProductivity.create({
            datePeriod: item['dateperiod'],
            strategy: await MroStrategy.findOneBy({
              name: item['strategyname'],
            }),
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
              inventoryNumber: item['inventorynumber'],
            }),
            productivity: item['productivity'],
            isModel: item['isModel'] === 't',
            workTime: item['worktime_f'],
          });
        }

        workTimeProductivities[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}`
        ] = workTimeProductivity;
      }
    }

    try {
      for (const item of Object.values(workTimeProductivities)) {
        await item.save();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    this.logger.log('Work time productivity inserted');
  }

  private async insertIntoCTFRecordsTable(
    workTimeProductivityData: { [key: string]: any }[],
  ) {
    this.logger.log('Inserting into CTF records table');
    const CTFRecords: { [key: string]: CTFRecord } = {};

    for (const item of workTimeProductivityData) {
      if (
        !CTFRecords[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}`
        ]
      ) {
        let record: CTFRecord;

        const existingCTFRecord = await CTFRecord.findOneBy({
          datePeriod: item['dateperiod'],
          machine: await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          }),
        });

        if (existingCTFRecord != null) {
          existingCTFRecord.datePeriod = item['dateperiod'];
          existingCTFRecord.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            inventoryNumber: item['inventorynumber'],
          });
          existingCTFRecord.ctf_f = item['CTF_f'];
          existingCTFRecord.ctf_c = item['CTF_с'];
          existingCTFRecord.worktime_f = item['worktime_f'];
          existingCTFRecord.worktime_c = item['worktime_c'];
          existingCTFRecord.PlannedOaTD_f = item['PlannedOaTD_f'];
          existingCTFRecord.UnplannedOaTD_f = item['UnplannedOaTD_f'];
          existingCTFRecord.PlannedOaTD_c = item['PlannedOaTD_c'];
          existingCTFRecord.UnplannedOaTD_c = item['UnplannedOaTD_c'];
          existingCTFRecord.PlannedRepair_f = item['PlannedRepair_f'];
          existingCTFRecord.PlannedRepair_c = item['PlannedRepair_c'];
          existingCTFRecord.UnplannedRepair_f = item['UnplannedRepair_f'];
          existingCTFRecord.UnplannedRepair_c = item['UnplannedRepair_c'];
          record = existingCTFRecord;
        } else {
          record = CTFRecord.create({
            datePeriod: item['dateperiod'],
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
              inventoryNumber: item['inventorynumber'],
            }),
            ctf_f: item['CTF_f'],
            ctf_c: item['CTF_с'],
            worktime_f: item['worktime_f'],
            worktime_c: item['worktime_c'],
            PlannedOaTD_f: item['PlannedOaTD_f'],
            UnplannedOaTD_f: item['UnplannedOaTD_f'],
            PlannedOaTD_c: item['PlannedOaTD_c'],
            UnplannedOaTD_c: item['UnplannedOaTD_c'],
            PlannedRepair_f: item['PlannedRepair_f'],
            PlannedRepair_c: item['PlannedRepair_c'],
            UnplannedRepair_f: item['UnplannedRepair_f'],
            UnplannedRepair_c: item['UnplannedRepair_c'],
          });
        }

        CTFRecords[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}`
        ] = record;
      }
    }

    try {
      await CTFRecord.save(Object.values(CTFRecords), {
        chunk: 500,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('CTF records inserted');
  }

  private async insertIntoCostsKindsTable(costsData: { [key: string]: any }[]) {
    this.logger.log('Inserting into costs kinds table');
    const costsKinds: { [key: string]: CostsKind } = {};

    for (const item of costsData) {
      if (!costsKinds[`${item['namecosts']}_false`]) {
        let costsKindFactual: CostsKind;

        const existingCostsKindFactual = await CostsKind.findOneBy({
          name: item['namecosts'],
          isModel: false,
        });

        if (existingCostsKindFactual != null) {
          existingCostsKindFactual.name = item['namecosts'];
          existingCostsKindFactual.isModel = false;
          costsKindFactual = existingCostsKindFactual;
        } else {
          costsKindFactual = CostsKind.create({
            name: item['namecosts'],
            isModel: false,
          });
        }

        costsKinds[`${item['namecosts']}_false`] = costsKindFactual;
      }

      if (!costsKinds[`${item['namecosts']}_true`]) {
        let costsKindCalculated: CostsKind;

        const existingCostsKindCalculated = await CostsKind.findOneBy({
          name: item['namecosts'],
          isModel: true,
        });

        if (existingCostsKindCalculated != null) {
          existingCostsKindCalculated.name = item['namecosts'];
          existingCostsKindCalculated.isModel = true;
          costsKindCalculated = existingCostsKindCalculated;
        } else {
          costsKindCalculated = CostsKind.create({
            name: item['namecosts'],
            isModel: true,
          });
        }

        costsKinds[`${item['namecosts']}_true`] = costsKindCalculated;
      }
    }

    try {
      await Promise.all(
        Object.values(costsKinds).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Costs kinds inserted');
  }

  private async insertIntoCostsTable(costsData: { [key: string]: any }[]) {
    this.logger.log('Inserting into costs table');
    const costs: { [key: string]: Cost } = {};

    for (const item of costsData) {
      if (
        !costs[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}_${item['namecosts']}_false`
        ]
      ) {
        let costFactual: Cost;

        const existingCostFactual = await Cost.findOneBy({
          datePeriod: item['dateperiod'],
          machine: await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            inventoryNumber: item['inventorynumber'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          }),
          strategy: await MroStrategy.findOneBy({
            name: item['strategyname'],
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          }),
          kind: await CostsKind.findOneBy({
            name: item['namecosts'],
            isModel: false,
          }),
          isModel: false,
        });

        if (existingCostFactual != null) {
          existingCostFactual.datePeriod = item['dateperiod'];
          existingCostFactual.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            inventoryNumber: item['inventorynumber'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          });
          existingCostFactual.strategy = await MroStrategy.findOneBy({
            name: item['strategyname'],
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
          existingCostFactual.kind = await CostsKind.findOneBy({
            name: item['namecosts'],
            isModel: false,
          });
          existingCostFactual.value = item['value_f'];
          existingCostFactual.isModel = false;
          costFactual = existingCostFactual;
        } else {
          costFactual = Cost.create({
            datePeriod: item['dateperiod'],
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              inventoryNumber: item['inventorynumber'],
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
            }),
            strategy: await MroStrategy.findOneBy({
              name: item['strategyname'],
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            kind: await CostsKind.findOneBy({
              name: item['namecosts'],
              isModel: false,
            }),
            value: item['value_f'],
            isModel: false,
          });
        }

        costs[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}_${item['namecosts']}_false`
        ] = costFactual;
      }

      if (
        !costs[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}_${item['namecosts']}_true`
        ]
      ) {
        let costCalculated: Cost;

        const existingCostCalculated = await Cost.findOneBy({
          datePeriod: item['dateperiod'],
          machine: await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            inventoryNumber: item['inventorynumber'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          }),
          strategy: await MroStrategy.findOneBy({
            name: item['strategyname'],
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          }),
          kind: await CostsKind.findOneBy({
            name: item['namecosts'],
            isModel: true,
          }),
          isModel: true,
        });

        if (existingCostCalculated != null) {
          existingCostCalculated.datePeriod = item['dateperiod'];
          existingCostCalculated.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            inventoryNumber: item['inventorynumber'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          });
          existingCostCalculated.strategy = await MroStrategy.findOneBy({
            name: item['strategyname'],
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
          existingCostCalculated.kind = await CostsKind.findOneBy({
            name: item['namecosts'],
            isModel: true,
          });
          existingCostCalculated.value = item['value_c'];
          existingCostCalculated.isModel = true;
          costCalculated = existingCostCalculated;
        } else {
          costCalculated = Cost.create({
            datePeriod: item['dateperiod'],
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              inventoryNumber: item['inventorynumber'],
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
            }),
            strategy: await MroStrategy.findOneBy({
              name: item['strategyname'],
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            kind: await CostsKind.findOneBy({
              name: item['namecosts'],
              isModel: true,
            }),
            value: item['value_c'],
            isModel: true,
          });
        }

        costs[
          `${item['dateperiod']}_${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['strategyname']}_${item['namecosts']}_true`
        ] = costCalculated;
      }
    }

    try {
      for (const item of Object.values(costs)) {
        await item.save();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Costs inserted');
  }

  async insertIntoFaultsTable(faultsData: { [key: string]: any }[]) {
    this.logger.log('Inserting into faults table');

    const faults: { [key: string]: Fault } = {};

    for (const item of faultsData) {
      if (!faults[`${item['fault']}`]) {
        let fault: Fault;

        const existingFault = await Fault.findOneBy({
          name: item['fault'],
        });

        if (existingFault != null) {
          existingFault.name = item['fault'];
          fault = existingFault;
        } else {
          fault = Fault.create({
            name: item['fault'],
          });
        }

        faults[`${item['fault']}`] = fault;
      }
    }

    try {
      for (const item of Object.values(faults)) {
        await item.save();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Faults inserted');
  }

  async insertIntoPartsTable(breakdownsData: { [key: string]: any }[]) {
    this.logger.log('Inserting into parts table');
    const parts: { [key: string]: MachinePart } = {};

    for (const item of breakdownsData) {
      if (
        !parts[
          `${item['orgName']}_${item['machinename']}_${item['sub_assembly']}_${item['part']}`
        ]
      ) {
        let part: MachinePart;

        const existingPart = await MachinePart.findOneBy({
          part: item['part'],
          machineType: await MachineType.findOneBy({
            mark: await MachineMark.findOneBy({
              name: item['machinename'].split('_', 1)[0],
            }),
            name: item['machinename'].replace(
              item['machinename'].split('_', 1) + '_',
              '',
            ),
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          }),
          subAssembly: item['sub_assembly'],
        });

        if (existingPart != null) {
          existingPart.part = item['part'];
          existingPart.subAssembly = item['sub_assembly'];
          existingPart.machineType = await MachineType.findOneBy({
            mark: await MachineMark.findOneBy({
              name: item['machinename'].split('_', 1)[0],
            }),
            name: item['machinename'].replace(
              item['machinename'].split('_', 1) + '_',
              '',
            ),
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
          });
          part = existingPart;
        } else {
          part = MachinePart.create({
            part: item['part'],
            subAssembly: item['sub_assembly'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          });
        }

        parts[
          `${item['orgName']}_${item['machinename']}_${item['sub_assembly']}_${item['part']}`
        ] = part;
      }
    }

    try {
      await Promise.all(
        Object.values(parts).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Parts inserted');
  }

  async insertIntoBreakdownsTable(breakdownsData: { [key: string]: any }[]) {
    this.logger.log('Inserting into breakdowns table');
    const breakdowns: { [key: string]: Breakdown } = {};

    for (const item of breakdownsData) {
      if (
        !breakdowns[
          `${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['sub_assembly']}_${item['part']}_${item['fault']}_${item['datestartFault']}_${item['dateendFault']}_${item['isfull_failure']}`
        ]
      ) {
        let record: Breakdown;

        const existingBreakdown = await Breakdown.findOneBy({
          dateStartFault: item['datestartFault'],
          dateEndFault: item['dateendFault'],
          fault: await Fault.findOneBy({
            name: item['fault'],
          }),
          fullFailure: item['isfull_failure'],
          part: await MachinePart.findOneBy({
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
            part: item['part'],
            subAssembly: item['sub_assembly'],
          }),
          machine: await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            inventoryNumber: item['inventorynumber'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          }),
        });

        if (existingBreakdown != null) {
          existingBreakdown.dateStartFault = item['datestartFault'];
          existingBreakdown.dateEndFault = item['dateendFault'];
          existingBreakdown.fullFailure = item['isfull_failure'];
          existingBreakdown.machine = await Machine.findOneBy({
            organization: await Organization.findOneBy({
              name: item['orgName'],
            }),
            inventoryNumber: item['inventorynumber'],
            machineType: await MachineType.findOneBy({
              mark: await MachineMark.findOneBy({
                name: item['machinename'].split('_', 1)[0],
              }),
              name: item['machinename'].replace(
                item['machinename'].split('_', 1) + '_',
                '',
              ),
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
            }),
          });
          existingBreakdown.part = await MachinePart.findOneBy({
            part: item['part'],
            subAssembly: item['sub_assembly'],
          });
          existingBreakdown.fault = await Fault.findOneBy({
            name: item['fault'],
          });
          existingBreakdown.waitTime = item['wait_time'];
          existingBreakdown.repairTime = item['repair_time'];
          record = existingBreakdown;
        } else {
          record = Breakdown.create({
            dateStartFault: item['datestartFault'],
            dateEndFault: item['dateendFault'],
            fullFailure: item['isfull_failure'],
            machine: await Machine.findOneBy({
              organization: await Organization.findOneBy({
                name: item['orgName'],
              }),
              inventoryNumber: item['inventorynumber'],
              machineType: await MachineType.findOneBy({
                mark: await MachineMark.findOneBy({
                  name: item['machinename'].split('_', 1)[0],
                }),
                name: item['machinename'].replace(
                  item['machinename'].split('_', 1) + '_',
                  '',
                ),
                organization: await Organization.findOneBy({
                  name: item['orgName'],
                }),
              }),
            }),
            part: await MachinePart.findOneBy({
              part: item['part'],
              subAssembly: item['sub_assembly'],
            }),
            fault: await Fault.findOneBy({
              name: item['fault'],
            }),
            waitTime: item['wait_time'],
            repairTime: item['repair_time'],
          });
        }

        breakdowns[
          `${item['orgName']}_${item['machinename']}_${item['inventorynumber']}_${item['sub_assembly']}_${item['part']}_${item['fault']}_${item['datestartFault']}_${item['dateendFault']}_${item['isfull_failure']}`
        ] = record;
      }
    }

    try {
      await Promise.all(
        Object.values(breakdowns).map((item) => {
          return item.save();
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.logger.log('Breakdowns inserted');
  }

  async loadAllData(
    techSpecDataCSV: Express.Multer.File,
    workTimeProductivityDataCSV: Express.Multer.File,
    costsDataCSV: Express.Multer.File,
    breakdownsDataCSV: Express.Multer.File,
  ) {
    this.logger.log('Parsing data');
    // Parse and transform data from CSV
    const techSpecData: {
      [key: string]: any;
    }[] = this.parseAndTransformTechSpecData(techSpecDataCSV);

    const workTimeProductivityData: {
      [key: string]: any;
    }[] = this.parseAndTransformWorkTimeProductivityData(
      workTimeProductivityDataCSV,
    );

    const costsData: { [key: string]: any }[] =
      this.parseAndTransformCostsData(costsDataCSV);

    const breakdownsData: { [key: string]: any }[] =
      this.parseAndTransformBreakdownsData(breakdownsDataCSV);

    // Insert data into database
    this.logger.log('Inserting data into database');
    this.logger.log('Step 1');
    await Promise.all([
      this.insertIntoOrganizationsTable(techSpecData),
      this.insertIntoCostsKindsTable(costsData),
      this.insertIntoFaultsTable(breakdownsData),
    ]);
    await this.insertIntoMachineMarks(techSpecData);
    await this.insertIntoMachineTypesTable(techSpecData);

    this.logger.log('Step 2');
    await Promise.all([
      this.insertIntoMachinesTable(techSpecData),
      this.insertIntoMroStrategiesTable(workTimeProductivityData),
      this.insertIntoFacesTable(workTimeProductivityData),
      this.insertIntoPartsTable(breakdownsData),
    ]);

    this.logger.log('Step 3');
    await Promise.all([
      this.insertIntoMachine2StrategyTable(workTimeProductivityData),
      this.insertIntoCTFRecordsTable(workTimeProductivityData),
      this.insertIntoMachine2FaceTable(workTimeProductivityData, techSpecData),
      this.insertIntoBreakdownsTable(breakdownsData),
    ]);

    this.logger.log('Step 4');
    await this.insertIntoCostsTable(costsData);
    await this.insertIntoWorkTimeProductivityTable(workTimeProductivityData);

    this.logger.log('Data loaded successfully');

    // Return status message in JSON object
    return { status: 'success' };
  }

  async loadTechSpecData(techSpecDataCSV: Express.Multer.File) {
    this.logger.log('Parsing data');
    // Parse and transform data from CSV
    const techSpecData: {
      [key: string]: any;
    }[] = this.parseAndTransformTechSpecData(techSpecDataCSV);

    // Insert data into database
    this.logger.log('Inserting data into database');
    await this.insertIntoMachineMarks(techSpecData);
    await Promise.all([
      this.insertIntoMachineTypesTable(techSpecData),
      this.insertIntoOrganizationsTable(techSpecData),
    ]);

    await this.insertIntoMachinesTable(techSpecData);

    this.logger.log('Data loaded successfully');

    // Return status message in JSON object
    return { status: 'success' };
  }

  async loadWorkTimeProductivityData(
    workTimeProductivityDataCSV: Express.Multer.File,
  ) {
    this.logger.log('Parsing data');
    // Parse and transform data from CSV
    const workTimeProductivityData: {
      [key: string]: any;
    }[] = this.parseAndTransformWorkTimeProductivityData(
      workTimeProductivityDataCSV,
    );

    // Insert data into database
    this.logger.log('Inserting data into database');
    await Promise.all([
      this.insertIntoFacesTable(workTimeProductivityData),
      this.insertIntoMroStrategiesTable(workTimeProductivityData),
    ]);

    await this.insertIntoMachine2StrategyTable(workTimeProductivityData);
    await this.insertIntoWorkTimeProductivityTable(workTimeProductivityData);

    this.logger.log('Data loaded successfully');

    // Return status message in JSON object
    return { status: 'success' };
  }

  async loadCostsData(costsDataCSV: Express.Multer.File) {
    this.logger.log('Parsing data');
    // Parse and transform data from CSV
    const costsData: { [key: string]: any }[] =
      this.parseAndTransformCostsData(costsDataCSV);

    // Insert data into database
    this.logger.log('Inserting data into database');
    await this.insertIntoCostsKindsTable(costsData);
    await this.insertIntoCostsTable(costsData);

    this.logger.log('Data loaded successfully');

    // Return status message in JSON object
    return { status: 'success' };
  }

  async loadBreakdownsData(
    breakdownsDataCSV: Express.Multer.File,
  ): Promise<{ status: string }> {
    this.logger.log('Parsing data');
    // Parse and transform data from CSV
    const breakdownsData: { [key: string]: any }[] =
      this.parseAndTransformBreakdownsData(breakdownsDataCSV);

    // Insert data into database
    this.logger.log('Inserting data into database');
    await this.insertIntoFaultsTable(breakdownsData);
    await this.insertIntoPartsTable(breakdownsData);
    await this.insertIntoBreakdownsTable(breakdownsData);

    this.logger.log('Data loaded successfully');

    // Return status message in JSON object
    return { status: 'success' };
  }
}
