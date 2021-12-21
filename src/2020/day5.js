"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "BFFFBBFRRR",
  "FFFBBBFRRR",
  "BBFFBBFRLL"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  return( lines );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function getRowSeatNumbers( input ) {
  let matches = input.match( /^([FB]{7})([RL]{3})$/ );

  let row_binary  = matches[1].replace( /F/g, "0" ).replace( /B/g, "1" );
  let seat_binary = matches[2].replace( /L/g, "0" ).replace( /R/g, "1" );

  let row  = parseInt( row_binary, 2 );
  let seat = parseInt( seat_binary, 2 );

  return( [ row, seat ] );
}



/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let max_id = 0;

  for( let str of input ) {
    let [ row, seat ] = getRowSeatNumbers( str );

    let seat_id = row * 8 + seat;

    if( seat_id > max_id ) {
      max_id = seat_id;
    }
  }

  answer = max_id;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let seats = [];

  for( let str of input ) {
    let [ row, seat ] = getRowSeatNumbers( str );

    let seat_id = row * 8 + seat;

    seats.push( seat_id );
  }

  seats.sort( ( a, b ) => a - b );

  // console.log( JSON.stringify( seats, null, 2 ) );

  let my_seat;

  for( let i = 0; i < seats.length - 1; i++ ) {
    if( seats[i] != seats[i + 1] - 1 ) {
      my_seat = seats[i] + 1;
    }
  }

  answer = my_seat;

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
