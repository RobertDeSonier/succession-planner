import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import * as CalendarActions from "./calendar.actions";
import * as fromApp from '../../store/app.reducers';
import { CalendarData } from "../calendar.model";
import { of } from "rxjs";

@Injectable()
export class CalendarEffects {
  fetchPlants = createEffect(() => this.actions$
    .pipe(
      ofType(CalendarActions.FETCH_CALENDAR_DATA),
      switchMap(actionData => {
        return this.http.get<CalendarDataDB[]>(
          'https://succession-planner-default-rtdb.firebaseio.com/calendar_data.json'
        )
      }),
      withLatestFrom(this.store.select('plants')),
      map(([data, plantsState]) => {
        if (!data || data.length <= 0) {
          return [];
        }
        return data
        .filter(dataPoint => plantsState.plants.some(plant => plant.id.localeCompare(dataPoint.plantId) === 0))
        .map(dataPoint => {
          const foundPlant = plantsState.plants.find(plant => plant.id.localeCompare(dataPoint.plantId) === 0);
          return new CalendarData(foundPlant, dataPoint.color, dataPoint.plantingDates.sort())})}),
      map(data => new CalendarActions.SetCalendarData(data ?? []))
    ));

  storeCalendarData = createEffect(() => this.actions$
    .pipe(
      ofType(CalendarActions.STORE_CALENDAR_DATA),
      withLatestFrom(this.store.select('calendar')),
      map(([actionData, calendarState]) => calendarState.calendarData.map(data => new CalendarDataDB(data.plant.id, data.color, data.plantingDates))),
      switchMap(calendarDataDB => {
        return this.http.put(
          'https://succession-planner-default-rtdb.firebaseio.com/calendar_data.json',
          calendarDataDB
        );
      })
    ),
  {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}

class CalendarDataDB {
  constructor(public plantId: string, public color: string, public plantingDates: Date[]) {}
}