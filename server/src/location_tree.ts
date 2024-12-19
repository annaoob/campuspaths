import {
  Location, Region, centroid, isInRegion,
  locationsInRegion, overlap, distanceMoreThan, distance,
} from "./locations";


export type LocationTree =
  | {readonly kind: "empty"}
  | {readonly kind: "single", readonly loc: Location}
  | {readonly kind: "split", readonly at: Location,
     readonly nw: LocationTree, readonly ne: LocationTree,
     readonly sw: LocationTree, readonly se: LocationTree};


/**
* Returns a tree containing exactly the given locations. Some effort is made to
* try to split the locations evenly so that the resulting tree has low height.
*/
export const buildTree = (locs: Array<Location>): LocationTree => {
if (locs.length === 0) {
  return {kind: "empty"};
} else if (locs.length === 1) {
  return {kind: "single", loc: locs[0]};
} else {
  // We must be careful to include each point in *exactly* one subtree. The
  // regions created below touch on the boundary, so we exlude them from the
  // lower side of each boundary.
  const c: Location = centroid(locs);
  return {kind: "split", at: c,
      nw: buildTree(locationsInRegion(locs,
          {x1: -Infinity, x2: c.x, y1: -Infinity, y2: c.y})
          .filter(loc => loc.x !== c.x && loc.y !== c.y)),  // exclude boundaries
      ne: buildTree(locationsInRegion(locs,
          {x1: c.x, x2: Infinity, y1: -Infinity, y2: c.y})
          .filter(loc => loc.y !== c.y)),  // exclude Y boundary
      sw: buildTree(locationsInRegion(locs,
          {x1: -Infinity, x2: c.x, y1: c.y, y2: Infinity})
          .filter(loc => loc.x !== c.x)),  // exclude X boundary
      se: buildTree(locationsInRegion(locs,
          {x1: c.x, x2: Infinity, y1: c.y, y2: Infinity})),
    };
}
}


/** Returns all the locations in the given tree that fall within the region. */
export const findLocationsInRegion =
  (tree: LocationTree, region: Region): Array<Location> => {
const locs: Array<Location> = [];
addLocationsInRegion(tree, region,
    {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity}, locs);
return locs;
};

/**
* Adds all locations in the given tree that fall within the given region
* to the end of the given array.
* @param tree The (subtree) in which to search
* @param region Find locations inside this region
* @param bounds A region that contains all locations in the tree
* @param locs Array in which to add all the locations found
* @modifies locs
* @effects locs = locs_0 ++ all locations in the tree within this region
*/
const addLocationsInRegion =
  (tree: LocationTree, region: Region, bounds: Region, locs: Array<Location>): void => {

if (tree.kind === "empty") {
  // nothing to add

} else if (tree.kind === "single") {
  if (isInRegion(tree.loc, region))
    locs.push(tree.loc);

} else if (!overlap(bounds, region)) {
  // no points are within the region

} else {
  addLocationsInRegion(tree.nw, region,
    {x1: bounds.x1, x2: tree.at.x, y1: bounds.y1, y2: tree.at.y}, locs);
    addLocationsInRegion(tree.ne, region,
    {x1: tree.at.x, x2: bounds.x2, y1: bounds.y1, y2: tree.at.y}, locs);
    addLocationsInRegion(tree.sw, region,
    {x1: bounds.x1, x2: tree.at.x, y1: tree.at.y, y2: bounds.y2}, locs);
    addLocationsInRegion(tree.se, region,
    {x1: tree.at.x, x2: bounds.x2, y1: tree.at.y, y2: bounds.y2}, locs);
}
};


/**
* Returns closest of any locations in the tree to any of the given location.
* @param tree A tree containing locations to compare to
* @param loc The location to which to cmopare them
* @returns the closest point in the tree to that location, paired with its
*     distance to the closest location in locs
*/
export const findClosestInTree =
  (tree: LocationTree, locs: Array<Location>): [Location, number] => {
if (locs.length === 0)
  throw new Error('no locations passed in');
if (tree.kind === "empty")
  throw new Error('no locations in the tree passed in');

let closest = closestInTree(tree, locs[0], EVERYWHERE, NO_INFO);
for (const loc of locs) {
  const cl = closestInTree(tree, loc, EVERYWHERE, NO_INFO);
  if (cl.dist < closest.dist)
    closest = cl;
}
if (closest.loc === undefined)
  throw new Error('impossible: no closest found');
return [closest.loc, closest.dist];
};


/** Bounds that include the entire plane. */
const EVERYWHERE: Region = {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity};


/**
* A record containing the closest point found in the tree to reference point
* (or undefined if the tree is empty), the distance of that point to the
* reference point (or infinity if the tree is empty), and the number of
* distance calculations made during this process.
*/
type ClosestInfo = {loc: Location | undefined, dist: number, calcs: number};


/** A record that stores no closest point and no calculations performed. */
export const NO_INFO: ClosestInfo = {loc: undefined, dist: Infinity, calcs: 0};


/**
* Like above but also tracks all the information in a ClosestInfo record.
* The closest point returned is now the closer of the point found in the tree
* and the one passed in as an argument and the number of calculations is the
* sum of the number performed and the number passed in.
*/
export const closestInTree =
  (tree: LocationTree, loc: Location, bounds: Region, closest: ClosestInfo): ClosestInfo => {
  // TODO: implement in Task 4
  // if distance to region is greater than distance to closest, skip that region
  if (distanceMoreThan(loc, bounds, closest.dist)) {
    return closest;
  } 
  // if the tree is empty, return closest
  else if (tree.kind === 'empty') {
    return closest;
  } 
  // if the tree has a single location, calculate distance to that location and return whether
  // the tree's location or closest is closer to loc
  else if (tree.kind === 'single') {
    closest.calcs = closest.calcs + 1;
    const distToTreeLoc: number = distance(tree.loc, loc);
    if (distToTreeLoc >= closest.dist) {
      return closest;
    } else {
      return {loc: tree.loc, dist: distToTreeLoc, calcs: closest.calcs};
    }
  } 
  // if the tree is split, figure out the order in which to recurse
  else {
    // these are how the NW, NE, SW, and SE are split
    const NW: Region = {x1: bounds.x1, x2: tree.at.x, y1: bounds.y1, y2: tree.at.y};
    const NE: Region = {x1: tree.at.x, x2: bounds.x2, y1: bounds.y1, y2: tree.at.y};
    const SW: Region = {x1: bounds.x1, x2: tree.at.x, y1: tree.at.y, y2: bounds.y2};
    const SE: Region = {x1: tree.at.x, x2: bounds.x2, y1: tree.at.y, y2: bounds.y2};
    // these will be the order in which we recurse over the regions
    let R1: Region = NW;
    let R2: Region = NE;
    let R3: Region = SW;
    let R4: Region = SE;
    // these will be the order in which we recurse over the trees in those regions
    let T1: LocationTree = tree.nw;
    let T2: LocationTree = tree.ne;
    let T3: LocationTree = tree.sw;
    let T4: LocationTree = tree.se;
    // if loc is in the NW region, the NW region will be recursed over first 
    // and the SE region will be recursed over last
    if (isInRegion(loc, NW)) {
      R1 = NW;
      T1 = tree.nw;
      // if NE region is further than the SW region, 
      // recurse over the SW region second and over the NE region third
      if (distanceMoreThan(loc, NE, SW.y1 - loc.y)) {
        R2 = SW;
        T2 = tree.sw;
        R3 = NE;
        T3 = tree.ne;
      } 
      // if NE region is closer than or equal distance away as the SW region,
      // recurse over the NE region second and the SW region third
      else {
        R2 = NE;
        T2 = tree.ne;
        R3 = SW;
        T3 = tree.sw;
      }
      R4 = SE;
      T4 = tree.se;
    } 
    // if loc is in the NE region, the NE region will be recursed over first 
    // and the SW region will be recursed over last
    else if (isInRegion(loc, NE)) {
      R1 = NE;
      T1 = tree.ne;
      // if NW region is further than the SE region, 
      // recurse over the SE region second and over the NW region third
      if (distanceMoreThan(loc, NW, SE.y1 - loc.y)) {
        R2 = SE;
        T2 = tree.se;
        R3 = NW;
        T3 = tree.nw;
      } 
      // if NW region is closer than or equal distance away as the SE region,
      // recurse over the NW region second and the SE region third
      else {
        R2 = NW;
        T2 = tree.nw;
        R3 = SE;
        T3 = tree.se;
      }
      R4 = SW;
      T4 = tree.sw;
    } 
    // if loc is in the SW region, the SW region will be recursed over first 
    // and the NE region will be recursed over last
    else if (isInRegion(loc, SW)) {
      R1 = SW;
      T1 = tree.sw;
      // if NW region is further than the SE region, 
      // recurse over the SE region second and over the NW region third
      if (distanceMoreThan(loc, NW, SE.x1 - loc.x)) {
        R2 = SE;
        T2 = tree.se;
        R3 = NW;
        T3 = tree.nw;
      } 
      // if NW region is closer than or equal distance away as the SE region,
      // recurse over the NW region second and the SE region third
      else {
        R2 = NW;
        T2 = tree.nw;
        R3 = SE;
        T3 = tree.se
      }
      R4 = NE;
      T4 = tree.ne;
    } 
    // if loc is in the SE region, the SE region will be recursed over first 
    // and the NE region will be recursed over last
    else if (isInRegion(loc, SE)) {
      R1 = SE;
      T1 = tree.se;
      // if NE region is further than the SW region, 
      // recurse over the SW region second and over the NE region third
      if (distanceMoreThan(loc, NE, loc.x - SW.x2)) {
        R2 = SW;
        T2 = tree.sw;
        R3 = NE;
        T3 = tree.ne;
      } 
      // if NE region is closer than or equal distance away as the SW region,
      // recurse over the NE region second and the SW region third
      else {
        R2 = NE;
        T2 = tree.ne;
        R3 = SW;
        T3 = tree.sw;
      }
      R4 = NW;
      T4 = tree.nw;
    } 
    // the closest in distance region should be the deepest recursion to set the closest location
    return closestInTree(T4, loc, R4, 
              closestInTree(T3, loc, R3, 
                closestInTree(T2, loc, R2, 
                  closestInTree(T1, loc, R1, closest))));
      
  }
}; 