import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { HarvestType, Plant } from "../plant.model";
import * as PlantActions from "./plant.actions";
import * as fromApp from '../../store/app.reducers';
import { AuthService } from "src/app/auth/auth.service";
import { Color } from "@angular-material-components/color-picker";

@Injectable()
export class PlantEffects {
  fetchPlants = createEffect(() => this.actions$
    .pipe(
      ofType(PlantActions.FETCH_PLANTS),
      withLatestFrom(this.authService.user),
      switchMap(([actionData, user]) => {
        return this.http.get<PlantDB[]>(
          `https://succession-planner-default-rtdb.firebaseio.com/${user.id}/plants.json`
        )
      }),
      map(plantsDb => {
        if (!plantsDb || plantsDb.length <= 0) {
          return [];
        }
        return plantsDb.map(plant => {
          const color = (plant.color && plant.color.r && plant.color.g && plant.color.b) ? new Color(plant.color.r, plant.color.g, plant.color.b, plant.color.a ?? 1) : Plant.defaultColor;
          return new Plant(plant.name, plant.daysToProduction, plant.harvestType, plant.monthsOfProduction, plant.sizeSquareInches, color, plant.id);
        });
      }),
      map(plants => new PlantActions.SetPlants(plants.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'accent'})) ?? []))
    ));

  storePlants = createEffect(() => this.actions$
    .pipe(
      ofType(PlantActions.STORE_PLANTS),
      withLatestFrom(this.store.select('plants')),
      map(([actionData, plantsState]) => plantsState.plants.map(plant => new PlantDB(plant.name, plant.daysToProduction, plant.harvestType, plant.monthsOfProduction, plant.sizeSquareInches, { r: plant.color.r, g: plant.color.g, b: plant.color.b, a: plant.color.a}, plant.id))),
      withLatestFrom(this.authService.user),
      switchMap(([plantsDb, user]) => {
        return this.http.put(
          `https://succession-planner-default-rtdb.firebaseio.com/${user.id}/plants.json`,
          plantsDb
        );
      })
    ),
  {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>, private authService: AuthService) {}
}

class PlantDB {
  constructor(public name: string,
    public daysToProduction: number,
    public harvestType: HarvestType,
    public monthsOfProduction: number,
    public sizeSquareInches: number,
    public color: { r: number, g: number, b: number, a: number },
    public id: string = null) {}
}
