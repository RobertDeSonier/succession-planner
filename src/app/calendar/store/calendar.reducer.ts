import { CalendarData } from "../calendar.model";
import * as CalendarActions from './calendar.actions';

export interface State {
  calendarData: CalendarData[];
}

const initialState: State = {
  calendarData: []
}

export function calendarReducer(state = initialState, action: CalendarActions.CalendarActions) {
  switch(action.type) {
    case CalendarActions.SET_CALENDAR_DATA:
      return {
        ...state,
        calendarData: [...action.payload]
      };
    case CalendarActions.ADD_CALENDAR_DATA:
      return {
        ...state,
        calendarData: [...state.calendarData, action.payload]
      };
    case CalendarActions.UPDATE_CALENDAR_DATA:
      let index = state.calendarData.findIndex(d => d.plant.id === action.payload.plantId);
      const updatedCalendarDataPoint = {
        ...state.calendarData[index],
        ...action.payload.newCalendarData
      };
      const updatedCalendarData = [...state.calendarData];
      updatedCalendarData[index] = updatedCalendarDataPoint;

      return {
        ...state,
        calendarData: updatedCalendarData
      };
    case CalendarActions.DELETE_CALENDAR_DATA:
      return {
        ...state,
        calendarData: state.calendarData.filter(data => data.plant.id !== action.payload)
      };
    default:
      return state;
  }
}
