export enum BreakdownType {
  year = 'year',
  quarter = 'quarter',
  month = 'month',
}

export interface IInputDataForVolumes {
  machineClassIds: Array<number>;
  machineMarkIds: Array<number>;
  machineTypeIds: Array<number>;
  machineIds: Array<number>;
  dateStart: Date;
  dateEnd: Date;
  breakdownType: BreakdownType;
}

export interface IInputDataForProductivity {
  machineClassIds: Array<number>;
  machineMarkIds: Array<number>;
  machineTypeIds: Array<number>;
  machineIds: Array<number>;
  dateStart: Date;
  dateEnd: Date;
  breakdownType: BreakdownType;
}

export interface IInputDataForDynamicsOfUnitCosts {
  machineClassIds: Array<number>;
  machineMarkIds: Array<number>;
  machineTypeIds: Array<number>;
  machineIds: Array<number>;
  dateStart: Date;
  dateEnd: Date;
  breakdownType: BreakdownType;
}

export interface IInputDataForCostComparison {
  machineClassIds: Array<number>;
  machineMarkIds: Array<number>;
  machineTypeIds: Array<number>;
  machineIds: Array<number>;
  dateStart: Date;
  dateEnd: Date;
}

export interface IInputDataForDynamicsOfUnitAccumulatedCosts {
  machineClassIds: Array<number>;
  machineMarkIds: Array<number>;
  machineTypeIds: Array<number>;
  machineIds: Array<number>;
  dateStart: Date;
  dateEnd: Date;
  breakdownType: BreakdownType;
}

export interface IInputDataForDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement {
  machineClassIds: Array<number>;
  machineMarkIds: Array<number>;
  machineTypeIds: Array<number>;
  machineIds: Array<number>;
  dateStart: Date;
  dateEnd: Date;
  breakdownType: BreakdownType;
}
