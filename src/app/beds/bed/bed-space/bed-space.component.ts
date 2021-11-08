import { Component, Input, OnInit } from '@angular/core';
import { SpaceType, SpaceTypeColorMapping } from '../../bed.model';

@Component({
  selector: 'app-bed-space',
  templateUrl: './bed-space.component.html',
  styleUrls: ['./bed-space.component.css']
})
export class BedSpaceComponent implements OnInit {
  @Input() type: SpaceType;

  spaceTypeColors = SpaceTypeColorMapping;

  constructor() { }

  ngOnInit(): void {
  }

  spaceClick() {
    console.log(this.type);
    this.type = this.type === SpaceType.empty ? SpaceType.planted : this.type === SpaceType.planted ? SpaceType.blocked : SpaceType.empty;
  }
}
