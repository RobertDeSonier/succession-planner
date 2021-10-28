import { Guid } from 'guid-typescript';

export enum HarvestType {
  harvest = 1,
  producer = 2
}

export class Plant {
  constructor(public name: string, public daysToProduction: number, public harvestType: HarvestType, public monthsOfProduction: number, public id: string = null) {
    this.id = this.id ?? Guid.raw();
  }
}
