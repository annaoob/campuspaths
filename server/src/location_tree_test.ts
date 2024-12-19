import * as assert from 'assert';
import {
    buildTree, findLocationsInRegion, findClosestInTree, closestInTree, LocationTree
  } from './location_tree';


describe('location_tree', function() {

  it('buildTree', function() {
    assert.deepStrictEqual(buildTree([]), {kind: "empty"});

    assert.deepStrictEqual(buildTree([{x: 1, y: 1}]),
        {kind: "single", loc: {x: 1, y: 1}});
    assert.deepStrictEqual(buildTree([{x: 2, y: 2}]),
        {kind: "single", loc: {x: 2, y: 2}});

    assert.deepStrictEqual(buildTree([{x: 1, y: 1}, {x: 3, y: 3}]),
        {kind: "split", at: {x: 2, y: 2},
         nw: {kind: "single", loc: {x: 1, y: 1}},
         ne: {kind: "empty"},
         sw: {kind: "empty"},
         se: {kind: "single", loc: {x: 3, y: 3}}});
    assert.deepStrictEqual(buildTree([{x: 1, y: 3}, {x: 3, y: 1}]),
        {kind: "split", at: {x: 2, y: 2},
         nw: {kind: "empty"},
         ne: {kind: "single", loc: {x: 3, y: 1}},
         sw: {kind: "single", loc: {x: 1, y: 3}},
         se: {kind: "empty"}});

    assert.deepStrictEqual(buildTree(
        [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 5}, {x: 7, y: 7}]),
        {kind: "split", at: {x: 4, y: 4},
         nw: {kind: "split", at: {x: 2, y: 2},
              nw: {kind: "single", loc: {x: 1, y: 1}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 3, y: 3}}},
         ne: {kind: "empty"},
         sw: {kind: "empty"},
         se: {kind: "split", at: {x: 6, y: 6},
              nw: {kind: "single", loc: {x: 5, y: 5}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 7, y: 7}}}});
    assert.deepStrictEqual(buildTree(
        [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 3}, {x: 7, y: 1},
         {x: 1, y: 7}, {x: 3, y: 5}, {x: 5, y: 5}, {x: 7, y: 7}]),
        {kind: "split", at: {x: 4, y: 4},
         nw: {kind: "split", at: {x: 2, y: 2},
              nw: {kind: "single", loc: {x: 1, y: 1}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 3, y: 3}}},
         ne: {kind: "split", at: {x: 6, y: 2},
              nw: {kind: "empty"},
              sw: {kind: "single", loc: {x: 5, y: 3}},
              ne: {kind: "single", loc: {x: 7, y: 1}},
              se: {kind: "empty"}},
         sw: {kind: "split", at: {x: 2, y: 6},
              nw: {kind: "empty"},
              ne: {kind: "single", loc: {x: 3, y: 5}},
              sw: {kind: "single", loc: {x: 1, y: 7}},
              se: {kind: "empty"}},
         se: {kind: "split", at: {x: 6, y: 6},
              nw: {kind: "single", loc: {x: 5, y: 5}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 7, y: 7}}}});
  });

  it('findLocationsInRegion', function() {
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([]),
        {x1: 1, x2: 2, y1: 1, y2: 2}),
      []);

    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 0}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      []);
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 2, y: 2}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 2, y: 2}]);

    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 0}, {x: 2, y: 2}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 2, y: 2}]);
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3},
                   {x: 4, y: 4}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]);
    assert.deepStrictEqual(findLocationsInRegion(
        buildTree([{x: 0, y: 4}, {x: 1, y: 3}, {x: 2, y: 2}, {x: 3, y: 4},
                   {x: 4, y: 0}]),
        {x1: 1, x2: 3, y1: 1, y2: 3}),
      [{x: 2, y: 2}, {x: 1, y: 3}]);
  });

  it('closestInTree', function() {
    // TODO: implement this in Task 4
    assert.deepStrictEqual(
      closestInTree({kind: 'empty'}, {x: 5, y: 5}, {x1: 6, x2: 10, y1: 6, y2: 10}, {loc: undefined, dist: 0, calcs: 0}),
      {loc: undefined, dist: 0, calcs: 0});
    assert.deepStrictEqual(
      closestInTree({kind: 'empty'}, {x: 5, y: 5}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: undefined, dist: Infinity, calcs: 0});
    assert.deepStrictEqual(
      closestInTree({kind: 'single', loc: {x: 5, y: 5}}, {x: 5, y: 5}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 5, y: 5}, dist: 0, calcs: 1});
    assert.deepStrictEqual(
      closestInTree({kind: 'single', loc: {x: 5, y: 5}}, {x: 9, y: 8}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 5, y: 5}, dist: 5, calcs: 1});
    assert.deepStrictEqual(
      closestInTree({kind: 'single', loc: {x: 5, y: 5}}, {x: 9, y: 8}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: {x: 9, y: 8}, dist: 0, calcs: 0}),
      {loc: {x: 9, y: 8}, dist: 0, calcs: 1});
    
    const multiNodeTree: LocationTree = {
      kind: 'split',
      at: {x: 5, y: 5},
      nw: {kind: 'single', loc: {x: 2, y: 2}},
      ne: {kind: 'single', loc: {x: 7, y: 2}},
      sw: {kind: 'single', loc: {x: 2, y: 7}},
      se: {kind: 'single', loc: {x: 7, y: 7}}}; 
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 2, y: 2}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 2, y: 2}, dist: 0, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 2, y: 3}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 2, y: 2}, dist: 1, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 3, y: 2}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 2, y: 2}, dist: 1, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 7, y: 2}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 7, y: 2}, dist: 0, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 7, y: 3}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 7, y: 2}, dist: 1, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 6, y: 2}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 7, y: 2}, dist: 1, calcs: 2});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 2, y: 7}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 2, y: 7}, dist: 0, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 2, y: 6}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 2, y: 7}, dist: 1, calcs: 2});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 3, y: 7}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 2, y: 7}, dist: 1, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 7, y: 7}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 7, y: 7}, dist: 0, calcs: 1});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 7, y: 6}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 7, y: 7}, dist: 1, calcs: 2});
    assert.deepStrictEqual(
      closestInTree(multiNodeTree, {x: 6, y: 7}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 7, y: 7}, dist: 1, calcs: 2});

    const complexTree: LocationTree = {
      kind: 'split',
      at: {x: 5, y: 5},
      nw: {
        kind: 'split',
        at: {x: 3, y: 3},
        nw: {kind: 'single', loc: {x: 1, y: 1}},
        ne: {kind: 'single', loc: {x: 4, y: 2}},
        sw: {kind: 'empty'},
        se: {kind: 'single', loc: {x: 3, y: 4 }}},
      ne: {kind: 'single', loc: {x: 7, y: 2 }},
      sw: {kind: 'single', loc: {x: 2, y: 7 }},
      se: {kind: 'empty'}
    };
    assert.deepStrictEqual(
      closestInTree(complexTree, {x: 4, y: 3}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 4, y: 2}, dist: 1, calcs: 4} );
    assert.deepStrictEqual(
      closestInTree(complexTree, {x: 3, y: 4}, {x1: 0, x2: 10, y1: 0, y2: 10}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 3, y: 4}, dist: 0, calcs: 1} 
    );

    assert.deepStrictEqual(
      closestInTree({kind: 'single', loc: {x: 5, y: 5}}, {x: 5, y: 5}, {x1: 0, x2: 0, y1: 0, y2: 0}, {loc: undefined, dist: Infinity, calcs: 0}),
      {loc: {x: 5, y: 5}, dist: 0, calcs: 1}
    );
        
    });

// TODO: uncomment these in Task 4
  it('findClosestInTree', function() {
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 2, y: 1}]),
        [{x: 1, y: 1}]),
      [{x: 2, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 3}]),
        [{x: 1, y: 1}]),
      [{x: 2, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}]),
      [{x: 1, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}, {x: 4.9, y: 4.9}]),
      [{x: 5, y: 5}, Math.sqrt((5-4.9)**2+(5-4.9)**2)]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}, {x: -1, y: -1}]),
      [{x: 1, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 4, y: 1}, {x: -1, y: -1}, {x: 10, y: 10}]),
      [{x: 5, y: 1}, 1]);
  });


});
