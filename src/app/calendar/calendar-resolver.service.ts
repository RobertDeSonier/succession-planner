import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { CalendarData } from "./calendar.model";
import { Store } from "@ngrx/store";
import { map, switchMap, take } from "rxjs/operators";
import * as fromApp from '../store/app.reducers';
import * as PlantActions from '../plants/store/plant.actions';
import * as CalendarActions from './store/calendar.actions';
import { Actions, ofType } from "@ngrx/effects";

@Injectable({providedIn: 'root'})
export class CalendarResolverService implements Resolve<CalendarData[]> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CalendarData[] | Observable<CalendarData[]> | Promise<CalendarData[]> {
    return this.store.select('plants').pipe(
      take(1),
      map(plantsState => plantsState.plants),
      switchMap(plants => {
        if (!plants || plants.length <= 0) {
          this.store.dispatch(new PlantActions.FetchPlants());
          return this.actions$.pipe(ofType(PlantActions.SET_PLANTS), take(1), switchMap(_ => this.store.select('calendar')));
        }
        return this.store.select('calendar');
      }),
      take(1),
      map(calendarState => calendarState.calendarData),
      switchMap(calendarData => {
        if (!calendarData || calendarData.length <= 0) {
          this.store.dispatch(new CalendarActions.FetchCalendarData());
          return this.actions$.pipe(ofType(CalendarActions.SET_CALENDAR_DATA), take(1));
        }
        return of(calendarData);
      })
    );
  }

}
