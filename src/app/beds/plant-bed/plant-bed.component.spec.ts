import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantBedComponent } from './plant-bed.component';

describe('PlantBedComponent', () => {
  let component: PlantBedComponent;
  let fixture: ComponentFixture<PlantBedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantBedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantBedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
