import { Action } from "@ngrx/store";
import { CalendarData } from "../calendar.model";

export const SET_CALENDAR_DATA = '[Calendar Data] Set';
export const FETCH_CALENDAR_DATA = '[Calendar Data] Fetch';
export const ADD_CALENDAR_DATA = '[Calendar Data] Add';
export const UPDATE_CALENDAR_DATA = '[Calendar Data] Update';
export const DELETE_CALENDAR_DATA = '[Calendar Data] Delete';
export const STORE_CALENDAR_DATA = '[Calendar Data] Store';
export const CLEAR_CALENDAR_DATA = '[Calendar Data] Clean';

export class SetCalendarData implements Action {
  readonly type = SET_CALENDAR_DATA;

  constructor(public payload: CalendarData[]){}
}

export class FetchCalendarData implements Action {
  readonly type = FETCH_CALENDAR_DATA;
}

export class AddCalendarData implements Action {
  readonly type = ADD_CALENDAR_DATA;

  constructor(public payload: CalendarData) {}
}

export class UpdateCalendarData implements Action {
  readonly type = UPDATE_CALENDAR_DATA;

  constructor(public payload: { plantId: string, newCalendarData: CalendarData }) {}
}

export class DeleteCalendarData implements Action {
  readonly type = DELETE_CALENDAR_DATA;

  constructor(public payload: string) {}
}

export class StoreCalendarData implements Action {
  readonly type = STORE_CALENDAR_DATA;
}

export class ClearCalendarData implements Action {
  readonly type = CLEAR_CALENDAR_DATA;
}

export type CalendarActions =
 | SetCalendarData
 | FetchCalendarData
 | AddCalendarData
 | UpdateCalendarData
 | DeleteCalendarData
 | StoreCalendarData
 | ClearCalendarData;
