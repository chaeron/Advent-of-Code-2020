"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "16,1,2,0,4,2,7,1,2,14"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Logging Functions
 * 
 ************************************************************************************/

const LOG = true;

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

    let crabs = line.split( ',' ).map( f => parseInt( f ) );

    parsed.push( ...crabs );
  }
  
  // log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function my_func( program, loc, accumulator ) {
  

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, input ) {
  let answer = 0;

  let min = Math.min( ...input );
  let max = Math.max( ...input );

  let min_fuel = Infinity;
  let min_x;

  for( let x = min; x <= max; x++ ) {
    let fuel = 0;

    for( let i = 0; i < input.length; i++ ) {
      fuel += Math.abs( x - input[i] );
    }

    if( fuel < min_fuel ) {
      min_fuel = fuel;
      min_x    = x;
    }
  }

  answer = min_fuel;

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let min = Math.min( ...input );
  let max = Math.max( ...input );

  let min_fuel = Infinity;
  let min_x;

  for( let x = min; x <= max; x++ ) {
    let fuel = 0;

    for( let i = 0; i < input.length; i++ ) {
      let steps = Math.abs( x - input[i] );

      fuel += steps * (steps + 1 ) / 2;
    }

    if( fuel < min_fuel ) {
      min_fuel = fuel;
      min_x    = x;
    }
  }

  answer = min_fuel;
  
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
