import { ActionReducerMap } from '@ngrx/store';
import * as fromPlants from '../plants/store/plant.reducer';
import * as fromCalendar from '../calendar/store/calendar.reducer';

export interface AppState {
  plants: fromPlants.State;
  calendar: fromCalendar.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  plants: fromPlants.plantReducer,
  calendar: fromCalendar.calendarReducer
}
