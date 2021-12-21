"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "0,3,6"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = new Map();            // Use a Map instead of an Object here, since it's more performant and accepts primitive values as keys

  let line = lines[0];

  let spoken = line.split( "," );

  for( let i = 0; i < spoken.length - 1; i++ ) {
    parsed.set( Number( spoken[i] ), i + 1 );
  }

  let last_spoken = Number( spoken[ spoken.length - 1 ] );

  console.log( `Last spoken: ${last_spoken}, turn: ${spoken.length}, spoken: ${JSON.stringify( parsed )}` );

  return( [ parsed, last_spoken, spoken.length ] );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function playGame( input, iterations ) {
  let [ spoken, last_spoken, start_turn ] = input;

  for( let turn = start_turn + 1; turn <= iterations; turn++ ) {
    let next_spoken;

    if( spoken.get( last_spoken ) == undefined ) {
      next_spoken = 0;
    } else {
      next_spoken = turn - spoken.get( last_spoken ) - 1; 
    }

    spoken.set( last_spoken, turn - 1 );

    last_spoken = next_spoken;

    // console.log( `Turn: ${turn}, Last spoken: ${last_spoken}, spoken: ${JSON.stringify( spoken )}` );
  }
  
  return( last_spoken );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  answer = playGame( input, 2020 );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }



 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  answer = playGame( input, 30000000 );

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
