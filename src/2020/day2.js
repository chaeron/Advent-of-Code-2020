"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "1-3 a: abcde",
  "1-3 b: cdefg",
  "2-9 c: ccccccccc"
]


const INPUT_REAL = fs.readFileSync( './src/2020/data/day2.data' ).toString().split( "\n" );


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {
    let matches = line.match( /^(\d+)-(\d+)\s(\S):\s(\S+)$/ )

    let entry = { policy: { 
                    min:  Number( matches[1] ), 
                    max:  Number( matches[2] ), 
                    char: matches[3] 
                  }, 
                  password: matches[4] };

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

  let valid_count = 0;

  for( let entry of input ) {
    let num_chars = ( entry.password.match( new RegExp( entry.policy.char, "g" ) ) || [] ).length;

    // console.log( `Password; ${entry.password}, char: ${entry.policy.char}, count: ${num_chars}` );

    if( num_chars >= entry.policy.min && num_chars <= entry.policy.max ) {
      valid_count++;
    }
  }

  answer = valid_count;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let valid_count = 0;

  for( let entry of input ) {
    let match_count = 0;

    if( entry.password[  entry.policy.min - 1 ] == entry.policy.char ) {
      match_count++;
    }

    if( entry.password[  entry.policy.max - 1 ] == entry.policy.char ) {
      match_count++;
    }
    
    if( match_count == 1 ) {
      valid_count++;
    }
  }

  answer = valid_count;
  
  console.log( `Day ${day} answer, part 2: ${answer}` );
 }


/************************************************************************************
 * 
 * Main
 * 
 ************************************************************************************/

const PART    = process.argv[2];
const TEST    = process.argv[3];

const DAY     = 2;

let input;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
