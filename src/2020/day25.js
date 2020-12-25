"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "5764801",
  "17807724"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );


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

    let entry = Number( line );

    parsed.push( entry );
  }
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function transform( value, subject_number ) {
  let new_value = ( value * subject_number ) % 20201227;

  return( new_value );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, input ) {
  let answer = 0;

  let subject_number  = 7;

  let value           = 1;
  let card_loop_size  = 0;
  let card_public_key = input[0]

  while( value != card_public_key ) {
    value = transform( value, subject_number );

    card_loop_size++;
  }

  log( `Card loop size: ${card_loop_size}` );

  let door_public_key = input[1];
  let encryption_key = 1;

  for( let loop = 0; loop < card_loop_size; loop ++ ) {
    encryption_key = transform( encryption_key, door_public_key );
  }

  answer = encryption_key;

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  
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
