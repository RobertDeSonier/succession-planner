import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HarvestType, Plant } from '../plant.model';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducers';
import * as PlantActions from '../store/plant.actions';

@Component({
  selector: 'app-plants-list',
  templateUrl: './plants-list.component.html',
  styleUrls: ['./plants-list.component.css']
})
export class PlantsListComponent implements OnInit, OnDestroy {
  plants: Plant[];
  subscriptions = new Subscription();

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select('plants')
        .pipe(map(plantsState => plantsState.plants))
        .subscribe((plants: Plant[]) => this.plants = plants));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addNewPlant() {
    this.store.dispatch(new PlantActions.AddPlant(new Plant('', 60, HarvestType.harvest, 0, 4)));
  }

  savePlants() {
    this.store.dispatch(new PlantActions.StorePlants());
  }
}
