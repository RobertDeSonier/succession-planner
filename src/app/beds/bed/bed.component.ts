import { Component, Input, OnInit } from '@angular/core';
import { BedSpace, SpaceType } from '../bed.model';

@Component({
  selector: 'app-bed',
  templateUrl: './bed.component.html',
  styleUrls: ['./bed.component.css']
})
export class BedComponent implements OnInit {
  @Input() numberOfColumns: number;
  @Input() bedSpaces: BedSpace[];

  columnStyle: string;

  constructor() { }

  ngOnInit(): void {
    this.columnStyle = `repeat(${this.numberOfColumns}, 5px)`;
  }

}
