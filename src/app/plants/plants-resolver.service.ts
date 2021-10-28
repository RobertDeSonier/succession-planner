import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { Plant } from "./plant.model";
import { Actions, ofType } from "@ngrx/effects";
import { map, switchMap, take } from "rxjs/operators";
import * as fromApp from '../store/app.reducers';
import * as PlantsActions from './store/plant.actions';

@Injectable({providedIn: 'root'})
export class PlantsResolverService implements Resolve<Plant[]> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Plant[] | Observable<Plant[]> | Promise<Plant[]> {
    return this.store.select('plants').pipe(
      take(1),
      map(plantsState => plantsState.plants),
      switchMap(plants => {
        if (!plants || plants.length <= 0) {
          this.store.dispatch(new PlantsActions.FetchPlants());
          return this.actions$.pipe(ofType(PlantsActions.SET_PLANTS), take(1));
        }
        return of(plants);
      })
    )
  }

}
