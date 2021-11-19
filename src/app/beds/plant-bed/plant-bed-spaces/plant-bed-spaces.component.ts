import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant-bed-spaces',
  templateUrl: './plant-bed-spaces.component.html',
  styleUrls: ['./plant-bed-spaces.component.css']
})
export class PlantBedSpacesComponent implements OnInit {
  @Input() plantSize: number;
  @Input() color: string;

  columnStyle: string;

  constructor() { }

  ngOnInit(): void {
    this.columnStyle = `repeat(${this.plantSize}, 5px)`;
  }

}
