import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { BUILDINGS, parseEdges } from './campus';
import {
    clearDataForTesting, getBuildings, getFriends, getSchedule, getShortestPath,
    setFriends, setSchedule
  } from './routes';
import { readFileSync } from 'fs';


const content: string = readFileSync("data/campus_edges.csv", {encoding: 'utf-8'});
parseEdges(content.split("\n"));


describe('routes', function() {

  it('friends', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {}}); 
    const res1 = httpMocks.createResponse();
    getFriends(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "user" was missing');

    // Request for friends not present already should return empty.
    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {user: "Kevin"}}); 
    const res2 = httpMocks.createResponse();
    getFriends(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {friends: []});

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends', body: {}}); 
    const res3 = httpMocks.createResponse();
    setFriends(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
            'missing or invalid "user" in POST body');

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends', body: {user: "Kevin"}}); 
    const res4 = httpMocks.createResponse();
    setFriends(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), 'missing "friends" in POST body');

    // Set the friends list to have multiple people on it.
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends',
         body: {user: "Kevin", friends: ["James", "Zach", "Anjali"]}}); 
    const res5 = httpMocks.createResponse();
    setFriends(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Get friends list again to make sure it was saved.
    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {user: "Kevin"}}); 
    const res6 = httpMocks.createResponse();
    getFriends(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(),
        {friends: ["James", "Zach", "Anjali"]});

    clearDataForTesting();
  });

  it('schedule', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {}}); 
    const res1 = httpMocks.createResponse();
    getSchedule(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "user" was missing');

    // Request for schedule not present already should return empty.
    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "Kevin"}}); 
    const res2 = httpMocks.createResponse();
    getSchedule(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {schedule: []});

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule', body: {}}); 
    const res3 = httpMocks.createResponse();
    setSchedule(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
            'missing or invalid "user" in POST body');

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule', body: {user: "Kevin"}}); 
    const res4 = httpMocks.createResponse();
    setSchedule(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), 'missing "schedule" in POST body');

    // Set the schedule to have two people on it.
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "Kevin", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},  // quantum ultra theory
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]}}); 
    const res5 = httpMocks.createResponse();
    setSchedule(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "Kevin"}}); 
    const res6 = httpMocks.createResponse();
    getSchedule(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(),
        {schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]});

    clearDataForTesting();
  });

  it('getBuildings', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/buildings', query: {}});
    const res1 = httpMocks.createResponse();
    getBuildings(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {buildings: BUILDINGS});
  });

  it('getShortestPath', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {}}); 
    const res1 = httpMocks.createResponse();
    getShortestPath(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "user" was missing');

    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin"}}); 
    const res2 = httpMocks.createResponse();
    getShortestPath(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "hour" was missing');

    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "9:30"}}); 
    const res3 = httpMocks.createResponse();
    getShortestPath(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'user has no saved schedule');

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "Kevin", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]}}); 
    const res4 = httpMocks.createResponse();
    setSchedule(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: true});

    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "8:30"}}); 
    const res5 = httpMocks.createResponse();
    getShortestPath(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), 'user has no event starting at this hour');

    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "9:30"}}); 
    const res6 = httpMocks.createResponse();
    getShortestPath(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        'user is not walking between classes at this hour');

    // loop coverage: 0 case
    const req7 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res7 = httpMocks.createResponse();
    getShortestPath(req7, res7);
    assert.deepStrictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().found, true);
    assert.deepStrictEqual(res7._getData().path.length > 0, true);
    assert.deepStrictEqual(res7._getData().nearby, []);

    // TODO: improve this test to include "nearby" results in Task 5
    // Set the schedule to have two people on it.
    
    // give Kevin friends
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends',
         body: {user: "Kevin", friends: ["James", "Zach", "Anjali"]}}); 
    const res8 = httpMocks.createResponse();
    setFriends(req8, res8);
    assert.deepStrictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData(), {saved: true});

    // Get friends list again to make sure it was saved.
    const req9 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {user: "Kevin"}}); 
    const res9 = httpMocks.createResponse();
    getFriends(req9, res9);
    assert.deepStrictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(),
        {friends: ["James", "Zach", "Anjali"]});

    // since Kevin isn't marked as a friend of James, Zach, or Anjali, should still not show anything nearby
    // test branch coverage (if (!isFriend(user, friend)))
    const req10 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res10 = httpMocks.createResponse();
    getShortestPath(req10, res10);
    assert.deepStrictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData().found, true);
    assert.deepStrictEqual(res10._getData().path.length > 0, true);
    assert.deepStrictEqual(res10._getData().nearby, []);

    // give James friends
    const req11 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends',
            body: {user: "James", friends: ["Kevin", "Zach", "Anjali"]}}); 
    const res11 = httpMocks.createResponse();
    setFriends(req11, res11);
    assert.deepStrictEqual(res11._getStatusCode(), 200);
    assert.deepStrictEqual(res11._getData(), {saved: true});

    // Get friends list again to make sure it was saved.
    const req12 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {user: "James"}}); 
    const res12 = httpMocks.createResponse();
    getFriends(req12, res12);
    assert.deepStrictEqual(res12._getStatusCode(), 200);
    assert.deepStrictEqual(res12._getData(),
        {friends: ["Kevin", "Zach", "Anjali"]});

    // since James doesn't have a schedule, should still not show anything nearby
    // test branch coverage (if (fSched == undefined))
    const req13 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res13 = httpMocks.createResponse();
    getShortestPath(req13, res13);
    assert.deepStrictEqual(res13._getStatusCode(), 200);
    assert.deepStrictEqual(res13._getData().found, true);
    assert.deepStrictEqual(res13._getData().path.length > 0, true);
    assert.deepStrictEqual(res13._getData().nearby, []);
    
    // give James a schedule
    const req14 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "James", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
          ]}}); 
    const res14 = httpMocks.createResponse();
    setSchedule(req14, res14);
    assert.deepStrictEqual(res14._getStatusCode(), 200);
    assert.deepStrictEqual(res14._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req15 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "James"}}); 
    const res15 = httpMocks.createResponse();
    getSchedule(req15, res15);
    assert.deepStrictEqual(res15._getStatusCode(), 200);
    assert.deepStrictEqual(res15._getData(),
        {schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
          ]});

    // since James isn't walking at 10:30, should still not show anything nearby
    // test branch coverage (if (fIndex <= 0))
    const req16 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res16 = httpMocks.createResponse();
    getShortestPath(req16, res16);
    assert.deepStrictEqual(res16._getStatusCode(), 200);
    assert.deepStrictEqual(res16._getData().found, true);
    assert.deepStrictEqual(res16._getData().path.length > 0, true);
    assert.deepStrictEqual(res16._getData().nearby, []);

    // give James a schedule identical to Kevin
    const req17 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "James", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]}}); 
    const res17 = httpMocks.createResponse();
    setSchedule(req17, res17);
    assert.deepStrictEqual(res17._getStatusCode(), 200);
    assert.deepStrictEqual(res17._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req18 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "James"}}); 
    const res18 = httpMocks.createResponse();
    getSchedule(req18, res18);
    assert.deepStrictEqual(res18._getStatusCode(), 200);
    assert.deepStrictEqual(res18._getData(),
        {schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]});

    // since James is walking at 10:30, should show him nearby
    // tests branch coverage (if none of the ifs happen)
    const req19 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res19 = httpMocks.createResponse();
    getShortestPath(req19, res19);
    assert.deepStrictEqual(res19._getStatusCode(), 200);
    assert.deepStrictEqual(res19._getData().found, true);
    assert.deepStrictEqual(res19._getData().path.length > 0, true);
    assert.deepStrictEqual(res19._getData().nearby, [{friend: "James", dist: 0, loc: {x: 2184.7074, y: 1045.0386}}]);
    
    // give James a schedule different to Kevin
    const req20 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "James", schedule: [
            {hour: "9:30", location: "CS2", desc: "CSE 989"},
            {hour: "10:30", location: "MLR", desc: "GREEK 101"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]}}); 
    const res20 = httpMocks.createResponse();
    setSchedule(req20, res20);
    assert.deepStrictEqual(res20._getStatusCode(), 200);
    assert.deepStrictEqual(res20._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req21 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "James"}}); 
    const res21 = httpMocks.createResponse();
    getSchedule(req21, res21);
    assert.deepStrictEqual(res21._getStatusCode(), 200);
    assert.deepStrictEqual(res21._getData(),
        {schedule: [
            {hour: "9:30", location: "CS2", desc: "CSE 989"},
            {hour: "10:30", location: "MLR", desc: "GREEK 101"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ]});

    // since James is walking at 10:30, should show him nearby
    // tests branch coverage (if none of the ifs happen)
    // tests loop coverage for 1 case
    const req22 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res22 = httpMocks.createResponse();
    getShortestPath(req22, res22);
    assert.deepStrictEqual(res22._getStatusCode(), 200);
    assert.deepStrictEqual(res22._getData().found, true);
    assert.deepStrictEqual(res22._getData().path.length > 0, true);
    assert.deepStrictEqual(res22._getData().nearby, [{friend: "James", dist: 0, loc: {x: 2184.7074, y: 1045.0386}}]);
    
    // give Zach a schedule
    const req23 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "Zach", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "HUB", desc: "nom nom"},
            {hour: "11:30", location: "CS2", desc: "CSE 989"},
          ]}}); 
    const res23 = httpMocks.createResponse();
    setSchedule(req23, res23);
    assert.deepStrictEqual(res23._getStatusCode(), 200);
    assert.deepStrictEqual(res23._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req24 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "Zach"}}); 
    const res24 = httpMocks.createResponse();
    getSchedule(req24, res24);
    assert.deepStrictEqual(res24._getStatusCode(), 200);
    assert.deepStrictEqual(res24._getData(),
        {schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "HUB", desc: "nom nom"},
            {hour: "11:30", location: "CS2", desc: "CSE 989"},
          ]});

    // give Anjali a schedule
    const req25 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "Anjali", schedule: [
            {hour: "9:30", location: "CS2", desc: "CSE 989"}, 
            {hour: "10:30", location: "HUB", desc: "nom nom"},
            {hour: "11:30", location: "MLR", desc: "GREEK 101"},
          ]}}); 
    const res25 = httpMocks.createResponse();
    setSchedule(req25, res25);
    assert.deepStrictEqual(res25._getStatusCode(), 200);
    assert.deepStrictEqual(res25._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req26 = httpMocks.createRequest(
        {method: 'GET', url: '/api/schedule', query: {user: "Anjali"}}); 
    const res26 = httpMocks.createResponse();
    getSchedule(req26, res26);
    assert.deepStrictEqual(res26._getStatusCode(), 200);
    assert.deepStrictEqual(res26._getData(),
        {schedule: [
            {hour: "9:30", location: "CS2", desc: "CSE 989"}, 
            {hour: "10:30", location: "HUB", desc: "nom nom"},
            {hour: "11:30", location: "MLR", desc: "GREEK 101"},
          ]});
    
    // Give Zach friends
    const req27 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends',
         body: {user: "Zach", friends: ["James", "Kevin", "Anjali"]}}); 
    const res27 = httpMocks.createResponse();
    setFriends(req27, res27);
    assert.deepStrictEqual(res27._getStatusCode(), 200);
    assert.deepStrictEqual(res27._getData(), {saved: true});

    // Get friends list again to make sure it was saved.
    const req28 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {user: "Zach"}}); 
    const res28 = httpMocks.createResponse();
    getFriends(req28, res28);
    assert.deepStrictEqual(res28._getStatusCode(), 200);
    assert.deepStrictEqual(res28._getData(),
        {friends: ["James", "Kevin", "Anjali"]});

    // Give Anjali friends
    const req29 = httpMocks.createRequest(
        {method: 'POST', url: '/api/friends',
         body: {user: "Anjali", friends: ["James", "Zach", "Kevin"]}}); 
    const res29 = httpMocks.createResponse();
    setFriends(req29, res29);
    assert.deepStrictEqual(res29._getStatusCode(), 200);
    assert.deepStrictEqual(res29._getData(), {saved: true});

    // Get friends list again to make sure it was saved.
    const req30 = httpMocks.createRequest(
        {method: 'GET', url: '/api/friends', query: {user: "Anjali"}}); 
    const res30 = httpMocks.createResponse();
    getFriends(req30, res30);
    assert.deepStrictEqual(res30._getStatusCode(), 200);
    assert.deepStrictEqual(res30._getData(),
        {friends: ["James", "Zach", "Kevin"]});
    
    // since James, Zach, and Anjali are walking at 10:30, should show them nearby
    // tests branch coverage (if none of the ifs happen)
    // tests loop coverage for many case
    const req31 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}}); 
    const res31 = httpMocks.createResponse();
    getShortestPath(req31, res31);
    assert.deepStrictEqual(res31._getStatusCode(), 200);
    assert.deepStrictEqual(res31._getData().found, true);
    assert.deepStrictEqual(res31._getData().path.length > 0, true);
    assert.deepStrictEqual(res31._getData().nearby, [{friend: "James", dist: 0, loc: {x: 2184.7074, y: 1045.0386}}, {friend: "Zach", dist: 0, loc: {x: 2184.7074, y: 1045.0386}}, {friend: "Anjali", dist: 0, loc: {x: 2236.9828, y: 1379.6516}}]);

    clearDataForTesting();
  });

});
