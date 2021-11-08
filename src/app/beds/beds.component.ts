import { Component, OnInit } from '@angular/core';
import { BedSpace, SpaceType } from './bed.model';

@Component({
  selector: 'app-beds',
  templateUrl: './beds.component.html',
  styleUrls: ['./beds.component.css']
})
export class BedsComponent implements OnInit {
  colNumber: number;
  rowNumber: number;
  bedSpaces: BedSpace[][];

  constructor() { }

  ngOnInit(): void {
    this.colNumber = 46;
    this.rowNumber = 92;
    this.bedSpaces = Array.from({length:this.rowNumber},()=>
      Array.from({length:this.colNumber},()=> ({spaceType: SpaceType.empty})));
  }

  getBedStartPosition() {
    return 'translate(100px, 80px)'
  }

  getBedWidth(colNumber: number) {
    return `${(colNumber * 6.3)}px`;
  }

  getBedHeight(rowNumber: number) {
    return `${(rowNumber * 6.3)}px`;
  }

  flattenBedSpaces(spaces: BedSpace[][]) {
    return [].concat(...spaces);
  }
}
