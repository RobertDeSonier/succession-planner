export enum SpaceType {
  empty = 1,
  planted = 2,
  blocked = 3
}

export const SpaceTypeColorMapping: Record<SpaceType, string> = {
  [SpaceType.empty]: 'burlywood',
  [SpaceType.planted]: 'green',
  [SpaceType.blocked]: 'dimgray'
}

export class Bed {
  constructor(public columns: number, public spaces: BedSpace[]) {}
}

export class BedSpace {
  constructor(public spaceType: SpaceType) {}
}
