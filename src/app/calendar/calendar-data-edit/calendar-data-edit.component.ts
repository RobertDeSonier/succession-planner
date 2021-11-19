import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Plant } from 'src/app/plants/plant.model';
import { CalendarData } from '../calendar.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Color } from '@angular-material-components/color-picker';
import * as fromApp from '../../store/app.reducers';
import * as calendarActions from '../store/calendar.actions';

@Component({
  selector: 'app-calendar-data-edit',
  templateUrl: './calendar-data-edit.component.html',
  styleUrls: ['./calendar-data-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarDataEditComponent implements OnInit, OnDestroy {
  plants: Plant[] = [];
  newPlants: Plant[] = [];
  dataForm: FormGroup = new FormGroup({});

  get dateControls() {
    return (this.dataForm.get('dates') as FormArray).controls;
  }

  private dateFormArray = () => (this.dataForm.get('dates') as FormArray);
  private routedId: string;
  private currentId: string;
  private calendarData: CalendarData[] = [];
  private subscriptions = new Subscription();

  constructor(private store: Store<fromApp.AppState>, @Inject(LOCALE_ID) private locale: string, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(this.route.params.pipe(take(1)).subscribe((params: Params) => {
      this.routedId = params['id'];
      if (this.calendarData.length > 0) {
        this.updateForm(this.routedId);
      }
    }));
    this.subscriptions.add(this.store.select('calendar').pipe(take(1)).subscribe(calendarState => {
      this.calendarData = calendarState.calendarData;
      this.plants = this.calendarData?.map(d => d.plant).sort((a, b) => a.name.localeCompare(b.name)) ?? [];
      this.newPlants = this.newPlants.filter(plant => !this.plants.some(p => p.id === plant.id));
      this.updateForm(this.dataForm?.value['plant'] ?? this.routedId ?? this.plants[0]?.id ?? this.newPlants[0]?.id);
    }));
    this.subscriptions.add(this.store.select('plants').pipe(take(1)).subscribe(plantsState => {
      this.newPlants = plantsState.plants.filter(plant => !this.plants.some(p => p.id === plant.id));
      this.updateForm(this.dataForm?.value['plant'] ?? this.routedId ?? this.plants[0]?.id ?? this.newPlants[0]?.id);
    }));

    this.subscriptions.add(this.dataForm.valueChanges
        .subscribe((formValue: { plant: string, color: Color, dates: Date[] }) => {
          if (formValue.plant !== this.currentId) {
            this.updateForm(formValue.plant);
            return;
          }

          const newPlanting = this.newPlants.find(p => p.id === formValue.plant);
          if (newPlanting) {
            this.store.dispatch(new calendarActions.AddCalendarData(new CalendarData(newPlanting, formValue.dates)));
            this.newPlants = this.newPlants.filter(p => p.id !== newPlanting.id);
            this.plants.push(newPlanting);
          } else {
            const plant = this.plants.find(p => p.id === formValue.plant);
            this.store.dispatch(new calendarActions.UpdateCalendarData({ plantId: plant.id, newCalendarData: new CalendarData(plant, formValue.dates)}))
          }
        }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm(id: string) {
    this.currentId = id;
    let data = this.calendarData.find(d => d.plant.id === id);

    this.dataForm = new FormGroup({
      'plant': new FormControl(id),
      'dates': new FormArray(this.createDateControls(data))
    });
  }

  updateForm(id: string) {
    if (!this.currentId) {
      this.initForm(id);
      return;
    }

    this.currentId = id;
    let data = this.calendarData.find(d => d.plant.id === id);
    this.dataForm.patchValue({
      'plant': id,
    }, { emitEvent: false});
    const dateArray = this.dateFormArray();
    dateArray.clear();
    this.createDateControls(data).forEach(d => dateArray.push(d));
  }

  private createDateControls(data: CalendarData) {
    return data?.plantingDates.map(date => new FormControl(formatDate(date ?? new Date(), 'yyyy-MM-dd', this.locale), Validators.required)) ?? [];
  }

  addDate() {
    this.dateFormArray().push(new FormControl(new Date(), Validators.required));
  }

  deleteDate(index: number) {
    this.dateFormArray().removeAt(index);
  }

  save() {
    this.store.dispatch(new calendarActions.StoreCalendarData());
  }
}
