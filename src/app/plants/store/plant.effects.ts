import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Plant } from "../plant.model";
import * as PlantActions from "./plant.actions";
import * as fromApp from '../../store/app.reducers';
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class PlantEffects {
  fetchPlants = createEffect(() => this.actions$
    .pipe(
      ofType(PlantActions.FETCH_PLANTS),
      withLatestFrom(this.authService.user),
      switchMap(([actionData, user]) => {
        return this.http.get<Plant[]>(
          `https://succession-planner-default-rtdb.firebaseio.com/${user.id}/plants.json`
        )
      }),
      map(plants => plants?.map(plant => new Plant(plant.name, plant.daysToProduction, plant.harvestType, plant.monthsOfProduction, plant.id)) ?? []),
      map(plants => new PlantActions.SetPlants(plants.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'accent'})) ?? []))
    ));

  storePlants = createEffect(() => this.actions$
    .pipe(
      ofType(PlantActions.STORE_PLANTS),
      withLatestFrom(this.store.select('plants')),
      withLatestFrom(this.authService.user),
      switchMap(([[actionData, plantsState], user]) => {
        return this.http.put(
          `https://succession-planner-default-rtdb.firebaseio.com/${user.id}/plants.json`,
          plantsState.plants
        );
      })
    ),
  {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>, private authService: AuthService) {}
}
