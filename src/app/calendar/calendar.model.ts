import { Color } from "@angular-material-components/color-picker";
import { Plant } from "../plants/plant.model";

export class CalendarData {
  static defaultColor = new Color(106, 90, 205);

  constructor(public plant: Plant, public color: Color, public plantingDates: Date[]) { }
}
