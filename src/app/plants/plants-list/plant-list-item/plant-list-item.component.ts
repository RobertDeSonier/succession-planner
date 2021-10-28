import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil, map } from 'rxjs/operators';
import * as fromApp from '../../../store/app.reducers';
import { HarvestType } from '../../plant.model';
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
  harvestTypeLabel: string;

  private subscriptions = new Subscription();
  private unsubscribe = new Subject<void>();

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.initForm();

    this.plantForm.valueChanges
    .pipe(debounceTime(1000),
          takeUntil(this.unsubscribe))
    .subscribe(formValue => {
        return this.store.dispatch(new PlantActions.UpdatePlant({ index: this.id, newPlant: formValue }));
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.subscriptions.unsubscribe();
  }

  deletePlant() {
    this.store.dispatch(new PlantActions.DeletePlant(this.id));
  }

  selectHarvestType(harvestType: HarvestType) {
    this.plantForm.patchValue({ 'harvestType': harvestType });

    this.isProducer = harvestType === HarvestType.producer;
    this.harvestTypeLabel = this.isProducer ? 'Producer' : 'Single Harvest';
  }

  private initForm() {
    let plantName = '';
    let plantDaysToProduction = 60;
    let plantHarvestType = HarvestType.harvest;
    let plantMonthsOfProduction = 1;


    this.subscriptions.add(this.store.select('plants')
      .pipe(map(plantsState => plantsState.plants.find((plant, index) => index === this.id)))
      .subscribe(plant => {
        plantName = plant.name;
        plantDaysToProduction = plant.daysToProduction;
        plantHarvestType = plant.harvestType;
        plantMonthsOfProduction = plant.monthsOfProduction;

        this.isProducer = plantHarvestType === HarvestType.producer;
        this.harvestTypeLabel = this.isProducer ? 'Producer' : 'Single Harvest';

        this.plantForm = new FormGroup({
          'name': new FormControl(plantName),
          'daysToProduction': new FormControl(plantDaysToProduction),
          'harvestType': new FormControl(plantHarvestType),
          'monthsOfProduction': new FormControl(this.isProducer ? plantMonthsOfProduction : 0)
        });
      }));
  }
}
