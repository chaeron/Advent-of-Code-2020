"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "35",
  "20",
  "15",
  "25",
  "47",
  "40",
  "62",
  "55",
  "65",
  "95",
  "102",
  "117",
  "150",
  "182",
  "127",
  "219",
  "299",
  "277",
  "309",
  "576"
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
    let entry = Number( line );

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

function findInvalid( preamble, input ) {
  for( let i = preamble; i < input.length; i++ ) {
    let value = input[ i ];

    let test_values = input.slice( i - preamble, i );

    // console.log( value )
    // console.log( test_values)

    let valid = false;

    for( let ti = 0; ti < test_values.length - 1; ti++ ) {
      for( let tj = ti + 1; tj < test_values.length; tj++ ) {
        if( value == test_values[ ti ] + test_values[ tj ] ) {
          valid = true;
          break;
        }
      }

      if( valid ) {
        break;
      }
    }

    if( !valid ) {
      return( value );
    }
  }

  console.log( "CRAPSTIX: Should exit before we get here!" );

}


function findWeakness( invalid, input ) {
  for( let len = 2; len < input.length; len++ ) {
    for( let i = 0; i < input.length - len; i++ ) {
      let test_range = input.slice( i, i + len );

      // console.log( `len: ${len}, i: ${i}, test_range: ${test_range}` );

      let test_sum = test_range.reduce( ( acc, cur ) => acc + cur );

      if( invalid == test_sum ) {
        return( Math.max( ...test_range ) + Math.min( ...test_range ) );
      }
    }
  }
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let preamble = input.length > INPUT_TEST.length ? 25 : 5;

  answer = findInvalid( preamble, input );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let preamble = input.length > INPUT_TEST.length ? 25 : 5;

  let invalid = findInvalid( preamble, input );

  answer = findWeakness( invalid, input );

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