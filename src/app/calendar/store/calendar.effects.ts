import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { CalendarData } from "../calendar.model";
import { Color } from "@angular-material-components/color-picker";
import * as CalendarActions from "./calendar.actions";
import * as fromApp from '../../store/app.reducers';

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
          const color = (dataPoint.color && dataPoint.color.r && dataPoint.color.g && dataPoint.color.b) ? new Color(dataPoint.color.r, dataPoint.color.g, dataPoint.color.b, dataPoint.color.a ?? 1) : CalendarData.defaultColor;
          return new CalendarData(foundPlant, color, dataPoint.plantingDates?.sort() ?? [])})}),
      map(data => new CalendarActions.SetCalendarData(data ?? []))
    ));

  storeCalendarData = createEffect(() => this.actions$
    .pipe(
      ofType(CalendarActions.STORE_CALENDAR_DATA),
      withLatestFrom(this.store.select('calendar')),
      map(([actionData, calendarState]) => calendarState.calendarData.map(data => new CalendarDataDB(data.plant.id, { r: data.color.r, g: data.color.g, b: data.color.b, a: data.color.a}, data.plantingDates))),
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
  constructor(public plantId: string, public color: { r: number, g: number, b: number, a: number }, public plantingDates: Date[]) {}
}
