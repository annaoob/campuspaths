/** Represents a location on the map. */
export type Location = {x: number, y: number};


/** Determines whether the two given locations are the same. */
export const sameLocation = (loc1: Location, loc2: Location): boolean => {
  return loc1.x === loc2.x && loc1.y === loc2.y;
}


/** Returns the squared distance between the two given locations */
export const squaredDistance = (loc1: Location, loc2: Location): number => {
  const dx = loc1.x - loc2.x;
  const dy = loc1.y - loc2.y;
  return dx*dx + dy*dy;
};


/** Returns the distance between the two given locations */
export const distance = (loc1: Location, loc2: Location): number => {
  return Math.sqrt(squaredDistance(loc1, loc2));
};


/**
 * Returns the locations in the given array but ordered so that they are
 * increasing in the given dimension.
 * @param locs The list of locations to sort
 * @param dim The coordinate to sort on
 * @returns The same locations as in locs but now in sorted order.
 */
export const sortedLocations =
    (locs: Array<Location>, dim: 'x' | 'y'): Array<Location> => {
  locs = locs.slice(0)
  if (dim === 'x') {
    locs.sort((a, b) => a.x - b.x);
  } else {
    locs.sort((a, b) => a.y - b.y);
  }
  return locs;
}


/**
 * Returns the average position of the given locations.
 * @requires locs.length >= 1
 */
export const centroid = (locs: Array<Location>): Location => {
  let sx = 0;
  let sy = 0;
  let i = 0;
  
  // Inv: sx = sum of locs[j].x for j = 0 .. i-1 and
  //      sy = sum of locs[j].y for j = 0 .. i-1
  while (i !== locs.length) {
    sx += locs[i].x;
    sy += locs[i].y;
    i = i + 1;
  }

  return {x: sx / locs.length, y: sy / locs.length};;
};


/**
 * Represents a rectangular range of space on the map. Note that infinite values
 * (Infinity and -Infinity) are allowed for the ends of either dimension.
 * Inv: x1 <= x2 and y1 <= y2
 */
export type Region = {x1: number, x2: number, y1: number, y2: number};


/** Determines whether the given location falls inside the given region. */
export const isInRegion = (loc: Location, region: Region): boolean => {
  return region.x1 <= loc.x && loc.x <= region.x2 &&
  region.y1 <= loc.y && loc.y <= region.y2;
}


/** Returns the subset of the given locations inside the given region. */
export const locationsInRegion =
    (locs: Array<Location>, region: Region): Array<Location> => {
  const inLocs: Array<Location> = [];

  // Inv: inLocs = locationsInRegion(locs[0 .. i-1], region)
  for (const loc of locs) {
    if (isInRegion(loc, region))
      inLocs.push(loc);
  }

  return inLocs;
};


/** Determines if the two given regions overlap. */
export const overlap = (region1: Region, region2: Region): boolean => {
  const noOverlapX = (region1.x2 < region2.x1) || (region2.x2 < region1.x1);
  const noOverlapY = (region1.y2 < region2.y1) || (region2.y2 < region1.y1);
  return !noOverlapX && !noOverlapY;
};


/**
 * Determines whether the distance of the given location to the closest point in
 * the given region is more than the given amount. Note that this calculation is
 * done without any calls to "distance" above (i.e., with no square roots).
 */
export const distanceMoreThan = (loc: Location, region: Region, dist: number): boolean => {
  // TODO: implement this in Task 3
  // if location is in region, return false (region is closer to loc)
  if ((region.x1 <= loc.x && loc.x <= region.x2) && (region.y1 <= loc.y && loc.y <= region.y2)) {
    return false;
  } 
  // if location is above or below region
  else if (region.x1 <= loc.x && loc.x <= region.x2) {
    // if above, return whether the distance from location to top of region is greater than dist
    if (region.y1 > loc.y) {
      return region.y1 - loc.y > dist;
    } 
    // if below, return whether the distance from location to bottom of region is greater than dist
    else {
      return loc.y - region.y2 > dist;
    }
  // if location is to the right or left of region
  } else if (region.y1 <= loc.y && loc.y <= region.y2) {
    // if to the left, return whether the distance from location to the left side of region is greater than dist
    if (region.x1 > loc.x) {
      return region.x1 - loc.x > dist;
    } 
    // if to the right, return whether the distance from location to the right side of region is greater than dist
    else {
      return loc.x - region.x2 > dist;
    } 
  // the closest point in region to location is the region's corner
  } else {
    const dx1 = region.x1 - loc.x;  // distance to region's left side
    const dx2 = region.x2 - loc.x;  // distance to region's right side
    const dy1 = region.y1 - loc.y;  // distance to region's top
    const dy2 = region.y2 - loc.y;  // distance to region's bottom
    // take the sum of the squared distance closest to either the region's left or right side 
    // and the squared distance closest to either the region's top or bottom
    // and return whether that sum is greater than the dist squared
    // (returns whether distance to closest corner in region is greater than dist)
    return Math.min(dx1*dx1, dx2*dx2) + Math.min(dy1*dy1, dy2*dy2) > dist*dist;
  }
}