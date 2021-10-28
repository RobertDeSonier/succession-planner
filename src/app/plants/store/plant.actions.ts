import { Action } from "@ngrx/store";
import { Plant } from "../plant.model";

export const SET_PLANTS = '[Plants] Set';
export const FETCH_PLANTS = '[Plants] Fetch';
export const ADD_PLANT = '[Plant] Add';
export const UPDATE_PLANT = '[Plant] Update';
export const DELETE_PLANT = '[Plant] Delete';
export const STORE_PLANTS = '[Plant] Store';

export class SetPlants implements Action {
  readonly type = SET_PLANTS;

  constructor(public payload: Plant[]){}
}

export class FetchPlants implements Action {
  readonly type = FETCH_PLANTS;
}

export class AddPlant implements Action {
  readonly type = ADD_PLANT;

  constructor(public payload: Plant) {}
}

export class UpdatePlant implements Action {
  readonly type = UPDATE_PLANT;

  constructor(public payload: { index: number, newPlant: Plant }) {}
}

export class DeletePlant implements Action {
  readonly type = DELETE_PLANT;

  constructor(public payload: number) {}
}

export class StorePlants implements Action {
  readonly type = STORE_PLANTS;
}

export type PlantActions =
 | SetPlants
 | FetchPlants
 | AddPlant
 | UpdatePlant
 | DeletePlant
 | StorePlants;
