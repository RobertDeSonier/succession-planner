import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantListItemComponent } from './plant-list-item.component';

describe('PlantListItemComponent', () => {
  let component: PlantListItemComponent;
  let fixture: ComponentFixture<PlantListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
