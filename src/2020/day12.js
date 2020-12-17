"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
"F10",
"N3",
"F7",
"R90",
"F11",
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {

    let matches = line.match( /^([A-Z])(\d*)$/ );

    let entry = [ matches[1], Number( matches[2] ) ];

    parsed.push( entry );
  }
  
  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function moveDirection( position, direction, distance ) {
  let EW = position.length == 2 ? 0 : 1;
  let NS = position.length == 2 ? 1 : 2;

  switch( direction ) {
    case "E":
      position[EW] += distance;
      break;
     
    case "W":
      position[EW] -= distance;
      break;

    case "N":
      position[NS] += distance;
      break;
      
    case "S":
      position[NS] -= distance;
      break;
  }

}

const LEFT = {
  N: "W",
  W: "S",
  S: "E",
  E: "N"
}

const RIGHT = {
  N: "E",
  E: "S",
  S: "W",
  W: "N"
}


function moveShip( ship, movement ) {
  let quadrants;
  let direction;

  switch( movement[0] ) {
    case "E":
    case "W":
    case "N":
    case "S":
      moveDirection( ship, movement[0], movement[1] );
      break;
  
    case "F":
      moveDirection( ship, ship[0], movement[1] );
      break;

    case "L":
      quadrants = movement[1] / 90;
      
      direction = ship[0];

      for( let i = 0; i < quadrants; i++ ) {
        direction = LEFT[ direction ];
      }
      
      ship[0] = direction;

      break;
  
    case "R":
      quadrants = movement[1] / 90;

      direction = ship[0];

      for( let i = 0; i < quadrants; i++ ) {
        direction = RIGHT[ direction ];
      }
      
      ship[0] = direction;

      break;
    
  }

}


function moveShipAndWaypoint( ship, waypoint, movement ) {
  let quadrants;

  switch( movement[0] ) {
    case "E":
    case "W":
    case "N":
    case "S":
      moveDirection( waypoint, movement[0], movement[1] );
      break;
  
    case "F":
      moveDirection( ship, "E", waypoint[0] * movement[1] );
      moveDirection( ship, "N", waypoint[1] * movement[1] );
      break;

    case "L":
      quadrants = movement[1] / 90;

      for( let i = 0; i < quadrants; i++ ) {
        let east = waypoint[0];

        waypoint[0] = -waypoint[1];
        waypoint[1] = east;
      }
      
      break;
  
    case "R":
      quadrants = movement[1] / 90;

      for( let i = 0; i < quadrants; i++ ) {
        let east = waypoint[0];

        waypoint[0] = waypoint[1];
        waypoint[1] = -east;
      }

      break;
    
  }

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let ship = [ "E", 0, 0 ];               // Facing, E+/w2, N+/S-

  for( let movement of input ) {
    moveShip( ship, movement );
  }

  answer = Math.abs( ship[1] ) + Math.abs( ship[2] );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let ship     = [ 0, 0 ];               // E+/w2, N+/S-
  let waypoint = [ 10, 1 ];

  for( let movement of input ) {
    moveShipAndWaypoint( ship, waypoint, movement );

    // console.log( `movement: ${movement}` );
    // console.log( `ship:     ${ship}` );
    // console.log( `waypoint: ${waypoint}` );
    // console.log();
  }

  answer = Math.abs( ship[0] ) + Math.abs( ship[1] );


  
  console.log( `Day ${day} answer, part 2: ${answer}` );
 }


/************************************************************************************
 * 
 * Main
 * 
 ************************************************************************************/

const PART    = process.argv[2];
const TEST    = process.argv[3];

let input;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
