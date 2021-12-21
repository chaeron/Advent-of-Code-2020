"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );
const { start } = require('repl');

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  16,
  10,
  15,
  5,
  1,
  11,
  7,
  19,
  6,
  12,
  4,
];

const INPUT_TEST2 = [
  28,
  33,
  18,
  42,
  31,
  14,
  46,
  20,
  48,
  47,
  24,
  23,
  49,
  45,
  19,
  38,
  39,
  11,
  1,
  32,
  25,
  35,
  8,
  17,
  7,
  9,
  4,
  2,
  34,
  10,
  3,
];


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
    let entry = Number( line );

    parsed.push( entry );
  }

  parsed.sort( (a,b) => a - b );

  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function getDifferences( input, outlet, laptop ) {
  let differences = {
    1: 0,
    2: 0,
    3: 0
  };

  differences[ input[0] - outlet ]++;                 // Initial outlet difference

  for( let i = 0; i < input.length - 1; i++ ) {
    let diff = input[i+1] - input[i];

    differences[ diff ]++;
     
  }

  differences[ laptop - input[input.length -1] ]++;   // Laptop difference

  // console.log( differences )

  return( differences );
}

function isValidPath( input, from, to ) {

}


// This would have been easier to solve using a tribonacci sequence rather than a hard to understand recursive function that does the same thing

function getPathPermutations( input, from, to, indent = "" ) {
  let permutations = 1;

  if( to - from > 1 ) {
    permutations = 0;

    let start_from = input[from] == 0 || indent != "" ? from : from + 1;

    // console.log( `${indent}start check premutations from value: ${input[start_from]} - ${input[to]}, diff: ${input[to]-input[start_from]}`)

    for( let i = start_from + 1; i <= to; i++ ) {
      if( i - start_from <= 3 ) {
        permutations += getPathPermutations( input, i, to, indent + "  " );
      } else {
        break;
      }
    }
   
  }

  // console.log( `${indent}done path count from: ${input[from]}, to: ${input[to]}, permutations: ${permutations}` );

  return( permutations );
}


function getArrangementsCount( input ) {
  let arrangements = 1;

  let diff3indexes = [ 0 ];

  for( let i = 0; i < input.length - 1; i++ ) {
    let diff = input[i+1] - input[i];

    if( diff == 3 ) {
      diff3indexes.push( i );
    }
  }

  diff3indexes.push( input.length - 1 );

  // console.log( input );
  // console.log( diff3indexes.map( i => input[i] ))


  for( let i = 0; i < diff3indexes.length - 1; i ++ ) {
    arrangements *= getPathPermutations( input, diff3indexes[i], diff3indexes[i+1] );
  }
 
  return( arrangements );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let laptop = Math.max( ...input ) + 3;

  let differences = getDifferences( input, 0, laptop );

  answer = differences[1] * differences[3];

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let laptop = Math.max( ...input ) + 3;

  let all = [ 0, ...input, laptop ];

  answer = getArrangementsCount( all ); 
  
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
