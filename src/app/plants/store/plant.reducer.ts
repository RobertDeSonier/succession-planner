import { Plant } from "../plant.model";
import * as PlantActions from './plant.actions';

export interface State {
  plants: Plant[];
}

const initialState: State = {
  plants: []
}

export function plantReducer(state = initialState, action: PlantActions.PlantActions) {
  switch(action.type) {
    case PlantActions.SET_PLANTS:
      return {
        ...state,
        plants: [...action.payload]
      };
    case PlantActions.ADD_PLANT:
      return {
        ...state,
        plants: [...state.plants, action.payload]
      };
    case PlantActions.UPDATE_PLANT:
      const updatedPlant = {
        ...state.plants[action.payload.index],
        ...action.payload.newPlant
      };
      const updatedPlants = [...state.plants];
      updatedPlants[action.payload.index] = updatedPlant;

      return {
        ...state,
        plants: updatedPlants
      };
    case PlantActions.DELETE_PLANT:
      return {
        ...state,
        plants: state.plants.filter((_, index) => index !== action.payload)
      };
    case PlantActions.CLEAR_PLANTS:
      return {
        ...state,
        plants: []
      }
    default:
      return state;
  }
}
