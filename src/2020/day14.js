"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "nop +0",
  "acc +1",
  "jmp +4",
  "acc +3",
  "jmp -3",
  "acc -99",
  "acc +1",
  "jmp -4",
  "acc +6",
]


const INPUT_REAL = fs.readFileSync( './src/2020/data/day14.data' ).toString().split( "\n" );


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {



    let entry = null;

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

function my_fync( program, loc, accumulator ) {
  

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

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

const DAY     = 14;

let input;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
