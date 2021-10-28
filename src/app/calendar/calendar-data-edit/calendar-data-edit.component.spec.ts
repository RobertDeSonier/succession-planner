import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDataEditComponent } from './calendar-data-edit.component';

describe('CalendarDataEditComponent', () => {
  let component: CalendarDataEditComponent;
  let fixture: ComponentFixture<CalendarDataEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarDataEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
