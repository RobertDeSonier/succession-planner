import { Color } from '@angular-material-components/color-picker';
import { Guid } from 'guid-typescript';

export enum HarvestType {
  harvest = 1,
  producer = 2
}

export const HarvestTypeLabelMapping: Record<HarvestType, string> = {
  [HarvestType.harvest]: 'Single Harvest',
  [HarvestType.producer]: 'Producer'
}

export class Plant {
  static defaultColor = new Color(106, 90, 205);

  constructor(
    public name: string,
    public daysToProduction: number,
    public harvestType: HarvestType,
    public monthsOfProduction: number,
    public sizeSquareInches: number,
    public color: Color = Plant.defaultColor,
    public id: string = null) {
    this.id = this.id ?? Guid.raw();
  }
}
