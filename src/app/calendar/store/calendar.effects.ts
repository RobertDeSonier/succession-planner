import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { CalendarData } from "../calendar.model";
import { Color } from "@angular-material-components/color-picker";
import * as CalendarActions from "./calendar.actions";
import * as fromApp from '../../store/app.reducers';
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class CalendarEffects {
  fetchPlants = createEffect(() => this.actions$
    .pipe(
      ofType(CalendarActions.FETCH_CALENDAR_DATA),
      withLatestFrom(this.authService.user),
      switchMap(([actionData, user]) => {
        return this.http.get<CalendarDataDB[]>(
          `https://succession-planner-default-rtdb.firebaseio.com/${user.id}/calendar_data.json`
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
      withLatestFrom(this.authService.user),
      switchMap(([calendarDataDB, user]) => {
        return this.http.put(
          `https://succession-planner-default-rtdb.firebaseio.com/${user.id}/calendar_data.json`,
          calendarDataDB
        );
      })
    ),
  {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>, private authService: AuthService) {}
}

class CalendarDataDB {
  constructor(public plantId: string, public color: { r: number, g: number, b: number, a: number }, public plantingDates: Date[]) {}
}
