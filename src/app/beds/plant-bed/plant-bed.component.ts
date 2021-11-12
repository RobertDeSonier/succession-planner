import { Component, Input, OnInit } from '@angular/core';
import { Plant } from 'src/app/plants/plant.model';

@Component({
  selector: 'app-plant-bed',
  templateUrl: './plant-bed.component.html',
  styleUrls: ['./plant-bed.component.css']
})
export class PlantBedComponent implements OnInit {
  @Input() plant: Plant;

  constructor() { }

  ngOnInit(): void {
  }

}
