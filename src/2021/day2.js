"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "forward 5",
  "down 5",
  "forward 8",
  "up 3",
  "down 8",
  "forward 2"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Logging Functions
 * 
 ************************************************************************************/

const LOG = false;

function log( msg ) {
  if( LOG ) {
    console.log( msg );
  }
}


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {

    let entry = {
      direction:  line[0],
      distance:   parseInt( line.split( " " )[1] )
    }

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

function getPosition( input ) {
  let horizontal = 0;
  let depth      = 0;
  
  for( let move of input ) {
    switch( move.direction ) {
      case "f":
        horizontal += move.distance;
        break;

      case "u":
        depth -= move.distance;
        break;

      case "d":
        depth += move.distance;
        break;
    }
  }

  return( [ horizontal, depth ] );
}



function getPosition2( input ) {
  let horizontal = 0;
  let depth      = 0;
  let aim        = 0;
  
  for( let move of input ) {
    switch( move.direction ) {
      case "f":
        horizontal += move.distance;
        depth      += aim * move.distance;
        break;

      case "u":
        aim -= move.distance;
        break;

      case "d":
        aim += move.distance;
        break;
    }
  }

  return( [ horizontal, depth ] );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let [ horizontal, depth ] = getPosition( input );

  answer = horizontal * depth;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let [ horizontal, depth ] = getPosition2( input );

  answer = horizontal * depth;

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

if( TEST.startsWith( "t" )  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
