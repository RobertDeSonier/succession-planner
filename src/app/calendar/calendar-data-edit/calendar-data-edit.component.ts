import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Plant } from 'src/app/plants/plant.model';
import { CalendarData } from '../calendar.model';
import * as fromApp from '../../store/app.reducers';
import * as calendarActions from '../store/calendar.actions';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-calendar-data-edit',
  templateUrl: './calendar-data-edit.component.html',
  styleUrls: ['./calendar-data-edit.component.css']
})
export class CalendarDataEditComponent implements OnInit, OnDestroy {
  selectedPlant: Plant;
  plantColor: string;
  plants: Plant[] = [];
  newPlants: Plant[] = [];
  dataForm: FormGroup = new FormGroup({});


  get dateControls() {
    return (this.dataForm.get('dates') as FormArray).controls;
  }

  private readonly defaultColor = '#6A5ACD';
  private editId: string;
  private calendarData: CalendarData[] = [];
  private subscriptions = new Subscription();
  private valueChangedSub: Subscription;
  private unsubscribe = new Subject<void>();

  constructor(private store: Store<fromApp.AppState>, @Inject(LOCALE_ID) private locale: string, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(this.route.params.subscribe((params: Params) => {
      this.editId = params['id'];
      if (this.calendarData.length > 0) {
        this.selectPlant(this.editId);
      }
    }));
    this.subscriptions.add(this.store.select('calendar').subscribe(calendarState => {
      this.calendarData = calendarState.calendarData;
      this.plants = this.calendarData?.map(d => d.plant).sort((a, b) => a.name.localeCompare(b.name)) ?? [];
      this.newPlants = this.newPlants.filter(plant => !this.plants.some(p => p.id === plant.id));
      this.selectPlant(this.selectedPlant?.id ?? this.editId ?? this.plants[0]?.id ?? this.newPlants[0]?.id);
    }));
    this.subscriptions.add(this.store.select('plants').subscribe(plantsState => {
      this.newPlants = plantsState.plants.filter(plant => !this.plants.some(p => p.id === plant.id));
      this.selectPlant(this.selectedPlant?.id ?? this.editId ?? this.plants[0]?.id ?? this.newPlants[0]?.id);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.unsubscribe.next();
  }

  initForm() {
    this.valueChangedSub?.unsubscribe();
    this.valueChangedSub = new Subscription();
    let data = this.calendarData.find(d => d.plant.id === this.selectedPlant.id);
    this.plantColor = data?.color ?? this.defaultColor;

    this.dataForm = new FormGroup({
      'color': new FormControl(this.plantColor),
      'dates': new FormArray(data?.plantingDates.map(date => new FormControl(formatDate(date ?? new Date(), 'yyyy-MM-dd', this.locale), Validators.required)) ?? [])
    });

    this.valueChangedSub.add(this.dataForm.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribe))
        .subscribe((formValue: { color: string, dates: Date[] }) => this.store.dispatch(new calendarActions.UpdateCalendarData({ plantId: this.selectedPlant.id, newCalendarData: new CalendarData(this.selectedPlant, formValue.color, formValue.dates)}))));
  }

  selectPlant(id: string) {
    const newPlanting = this.newPlants.find(p => p.id === id);
    if (newPlanting) {
      this.selectedPlant = newPlanting;
      this.store.dispatch(new calendarActions.AddCalendarData(new CalendarData(this.selectedPlant, this.defaultColor, [])));
    } else {
      this.selectedPlant = this.plants.find(p => p.id === id);
    }
    this.initForm();
  }

  colorChanged(value: string) {
    this.dataForm.patchValue({'color': value}, { emitEvent: true });
  }

  addDate() {
    (this.dataForm.get('dates') as FormArray).push(new FormControl(new Date(), Validators.required));
  }

  deleteDate(index: number) {
    (this.dataForm.get('dates') as FormArray).removeAt(index);
  }

  save() {
    this.store.dispatch(new calendarActions.StoreCalendarData());
  }
}
