import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantBedSpacesComponent } from './plant-bed-spaces.component';

describe('PlantBedSpacesComponent', () => {
  let component: PlantBedSpacesComponent;
  let fixture: ComponentFixture<PlantBedSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantBedSpacesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantBedSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
