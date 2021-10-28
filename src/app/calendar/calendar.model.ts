import { Plant } from "../plants/plant.model";

export class CalendarData {
  constructor(public plant: Plant, public color: string, public plantingDates: Date[]) { }
}
