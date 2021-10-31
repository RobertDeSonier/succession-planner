import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import * as fromApp from '../../../store/app.reducers';
import { HarvestType, HarvestTypeLabelMapping } from '../../plant.model';
import * as PlantActions from '../../store/plant.actions';

@Component({
  selector: 'app-plant-list-item',
  templateUrl: './plant-list-item.component.html',
  styleUrls: ['./plant-list-item.component.css']
})
export class PlantListItemComponent implements OnInit, OnDestroy {
  @Input() id: number;
  plantForm: FormGroup;
  isProducer: boolean;

  harvestTypeLabels = HarvestTypeLabelMapping;
  harvestTypes = Object.values(HarvestType).filter(value => typeof value === 'number');

  private subscriptions = new Subscription();

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.initForm();

    this.subscriptions.add(this.plantForm.valueChanges
      .pipe(debounceTime(2000))
      .subscribe(formValue => {
        return this.store.dispatch(new PlantActions.UpdatePlant({ index: this.id, newPlant: formValue }));
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  deletePlant() {
    this.store.dispatch(new PlantActions.DeletePlant(this.id));
  }

  private initForm() {
    let plantName = '';
    let plantDaysToProduction = 60;
    let plantHarvestType = HarvestType.harvest;
    let plantMonthsOfProduction = 1;


    this.subscriptions.add(this.store.select('plants')
      .pipe(take(1), map(plantsState => plantsState.plants.find((plant, index) => index === this.id)))
      .subscribe(plant => {
        plantName = plant.name;
        plantDaysToProduction = plant.daysToProduction;
        plantHarvestType = plant.harvestType;
        plantMonthsOfProduction = plant.monthsOfProduction;

        this.isProducer = plantHarvestType === HarvestType.producer;

        this.plantForm = new FormGroup({
          'name': new FormControl(plantName, Validators.required),
          'daysToProduction': new FormControl(plantDaysToProduction, Validators.required),
          'harvestType': new FormControl(plantHarvestType, Validators.required),
          'monthsOfProduction': new FormControl(this.isProducer ? plantMonthsOfProduction : 0, Validators.required)
        });
      }));
  }
}
