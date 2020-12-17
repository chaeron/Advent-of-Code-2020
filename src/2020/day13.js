"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "939",
  "7,13,x,x,59,x,31,19"

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

  let departure = Number( lines[0] );

  let buses = [];

  for( let bus of lines[1].split( "," ) ) {
    if( bus != "x" ) {
      buses.push( Number( bus ) );
    } else {
      buses.push( bus );
    }
  }

  parsed = [ departure, buses ];
  
  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function getWaitTime( departure, bus ) {
  let wait = bus - ( ( departure + bus ) % bus );

  return( wait );
}


function chineseRemainderSieve( constraints ) {
  let time      = 0;
  let increment = 1;

  for( let i = 0; i < constraints.length; i++ ) {
    let bus       = constraints[i][0];
    let minutes   = constraints[i][1];

    // console.log( `i: ${i}, Bus: ${bus}, minutes: ${minutes}` );
    // console.log( `time: ${time}, increment: ${increment}` );

    while( ( time + minutes ) % bus != 0 ) {
      time += increment;
    }

    increment *= bus;
  }

  return( time );
}

/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let departure = input[0];

  let buses = input[1].filter( x => x != "x" );

  // console.log( buses );

  let min_wait = [ Infinity, null ];

  for( let bus of buses ) {
    let wait = getWaitTime( departure, bus );

    if( wait < min_wait[0] ) {
      min_wait = [ wait, bus ];
    }
  }

  // console.log( min_wait );

  answer = min_wait[0] * min_wait[1];

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let constraints = [];

  let buses = input[1];

  // buses = [ 17,"x",13,19 ];    // Simpler test case

  for( let i = 0; i < buses.length; i++ ) {
    if( buses[i] != "x" ) {
      constraints.push( [ buses[i], i ] );
    }
  }

  constraints.sort( (a,b) => b[0] - a[0] );

  // console.log( constraints );

  answer = chineseRemainderSieve( constraints );

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
