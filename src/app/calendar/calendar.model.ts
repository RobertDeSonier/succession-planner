import { Plant } from "../plants/plant.model";

export class CalendarData {
  constructor(public plant: Plant, public plantingDates: Date[]) { }
}
