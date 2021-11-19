import { Component, Input, OnInit } from '@angular/core';
import { Plant } from 'src/app/plants/plant.model';

@Component({
  selector: 'app-plant-bed',
  templateUrl: './plant-bed.component.html',
  styleUrls: ['./plant-bed.component.css']
})
export class PlantBedComponent implements OnInit {
  @Input() plant: Plant;

  columnStyle: string;

  constructor() { }

  ngOnInit(): void {
    this.columnStyle = `repeat(${this.plant.sizeSquareInches}, 5px)`;
  }

  getBedWidth() {
    return `${(this.plant.sizeSquareInches * 6.3)}px`;
  }

  getBedHeight() {
    return `${(this.plant.sizeSquareInches * 6.3)}px`;
  }
}
