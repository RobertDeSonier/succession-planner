import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { fromEvent, Subscription } from 'rxjs';
import { HarvestType, Plant } from '../plants/plant.model';
import * as fromApp from '../store/app.reducers';
import { CalendarData } from './calendar.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarData: CalendarData[] = [];
  plants: Plant[] = [];
  barColor: {name: string, color: string}[] = [];
  data: { name: string, order: number, start: Date, middle: Date, end: Date }[] = [];
  isScreenSmall = false;
  selectedPlantId: string;

  private subscriptions = new Subscription();

  constructor(private store: Store<fromApp.AppState>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isScreenSmall = window.innerWidth <= 500;
    this.subscriptions.add(this.store.select('calendar')
    .subscribe(calendarState => {
      this.calendarData = calendarState.calendarData;
      this.plants = this.calendarData.map(c => c.plant);
      this.selectedPlantId = this.plants[0].id;
      this.buildCalendarData(this.isScreenSmall ? this.selectedPlantId : null);
    }));
    this.subscriptions.add(fromEvent(window, 'resize').subscribe(e => {
      this.isScreenSmall = window.innerWidth <= 500;
      this.buildCalendarData(this.isScreenSmall ? this.selectedPlantId : null);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  plantEditClicked = (plant: string) => {
    const foundData = this.calendarData.find(d => d.plant.name === plant || d.plant.id === plant);
    this.router.navigate(['/calendar', 'edit', foundData.plant.id]);
  }

  plantSelected(plantId: string) {
    this.selectedPlantId = plantId;
    this.buildCalendarData(this.selectedPlantId);
  }

  private buildCalendarData(plantId?: string) {
    this.barColor = [];
    this.data = [];

    const filteredData = this.calendarData.filter(d => !plantId || d.plant.id === plantId)
    this.barColor = filteredData.map(d => ({name: d.plant.name, color: d.plant.color.toHexString()}));
    filteredData.forEach(d => d.plantingDates.forEach((date, i) =>
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
