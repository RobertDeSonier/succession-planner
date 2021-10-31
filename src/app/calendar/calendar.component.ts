import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HarvestType, Plant } from '../plants/plant.model';
import * as fromApp from '../store/app.reducers';
import { CalendarData } from './calendar.model';
import * as CalendarActions from './store/calendar.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  // constructor(private store: Store<fromApp.AppState>) { }
  calendarData: CalendarData[] = [];
  barColor: {name: string, color: string}[] = [];
  data: { name: string, order: number, start: Date, middle: Date, end: Date }[] = [];

  constructor(private store: Store<fromApp.AppState>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.store.select('calendar').subscribe(calendarState => {
      this.calendarData = calendarState.calendarData;
      this.buildCalendarData();
    });
  }

  plantEditClicked = (plantName: string) => {
    const foundData = this.calendarData.find(d => d.plant.name === plantName);
    this.router.navigate(['/calendar', 'edit', foundData.plant.id]);
  }

  private buildCalendarData() {
    this.barColor = [];
    this.data = [];

    this.barColor = this.calendarData.map(d => ({name: d.plant.name, color: d.color.toHexString()}));
    this.calendarData.forEach(d => d.plantingDates.forEach((date, i) =>
      {
        const start = new Date(date);
        start.setHours(0);
        return this.data.push({
          name: d.plant.name,
          order: i + 1,
          start: start,
          middle: this.getMiddleDate(start, d.plant),
          end: this.getEndDate(start, d.plant)})}));
  }

  private getMiddleDate(date: Date, plant: Plant) {
    return this.addDays(date, Number(plant.daysToProduction));
  }

  private getEndDate(date: Date, plant: Plant): Date {
    const daysToAdd = plant.harvestType === HarvestType.harvest ?
      Number(plant.daysToProduction) + 1 :
      Number(plant.daysToProduction) + Number(plant.monthsOfProduction) * 30;

    return this.addDays(date, Number(daysToAdd));
  }

  private addDays(date: Date, days: number) {
    const newDate = new Date(date);
    newDate.setDate(Number(newDate.getDate()) + Number(days));
    return newDate;
  }
}
