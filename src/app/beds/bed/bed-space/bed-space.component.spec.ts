import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedSpaceComponent } from './bed-space.component';

describe('BedSpaceComponent', () => {
  let component: BedSpaceComponent;
  let fixture: ComponentFixture<BedSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BedSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BedSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
