"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "00100",
  "11110",
  "10110",
  "10111",
  "10101",
  "01111",
  "00111",
  "11100",
  "10000",
  "11001",
  "00010",
  "01010",
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
    let entry = line;

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

// Could easily pull out the common logic, but sometimes brute force and cut 'n paste is faster, especially when real work becons! LOL

function getGamma( input ) {
  let gamma = "";

  let len = input[0].length;

  for( let idx = 0; idx < len; idx ++ ) {
    let zero = 0;
    let one  = 0;

    for( let i = 0; i < input.length; i++ ) {
      if( input[i][idx] == "1" ) {
        one++;
      } else {
        zero++;
      }
    }

    if( one > zero ) {
      gamma += "1";
    } else {
      gamma += "0";
    }
  }

  return( parseInt( gamma, 2 ) );
}


function getEpsilon( input ) {
  let epsilon = "";

  let len = input[0].length;

  for( let idx = 0; idx < len; idx ++ ) {
    let zero = 0;
    let one  = 0;

    for( let i = 0; i < input.length; i++ ) {
      if( input[i][idx] == "1" ) {
        one++;
      } else {
        zero++;
      }
    }

    if( one < zero ) {
      epsilon += "1";
    } else {
      epsilon += "0";
    }
  }

  return( parseInt( epsilon, 2 ) );

  return( epsilon );
}


function getOxygenGeneratorRating( input ) {
  let ogr = null;

  let len = input[0].length;

  let list = input;

  for( let idx = 0; idx < len; idx ++ ) {
    let next_list = [];

    let zero = 0;
    let one  = 0;

    for( let i = 0; i < list.length; i++ ) {
      if( list[i][idx] == "1" ) {
        one++;
      } else {
        zero++;
      }
    }

    let most_common = one >= zero ? "1" : "0";
    
    for( let i = 0; i < list.length; i++ ) {
      if( list[i][idx] == most_common ) {
        next_list.push( list[i] );
      }
    }

    if( next_list.length == 1 ) {
      ogr = next_list[0];
      break;
    } else {
      list = next_list;
    }
  }

  return( parseInt( ogr, 2 ) );
}


function getCO2ScubberRating( input ) {
  let co2sr = null;

  let len = input[0].length;

  let list = input;

  for( let idx = 0; idx < len; idx ++ ) {
    let next_list = [];

    let zero = 0;
    let one  = 0;

    for( let i = 0; i < list.length; i++ ) {
      if( list[i][idx] == "1" ) {
        one++;
      } else {
        zero++;
      }
    }

    let least_common = one < zero ? "1" : "0";
    
    for( let i = 0; i < list.length; i++ ) {
      if( list[i][idx] == least_common ) {
        next_list.push( list[i] );
      }
    }

    if( next_list.length == 1 ) {
      co2sr = next_list[0];
      break;
    } else {
      list = next_list;
    }
  }

  return( parseInt( co2sr, 2 ) );
}



/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let gamma   = getGamma( input );
  let epsilon = getEpsilon( input );

  answer = gamma * epsilon;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let ogr   = getOxygenGeneratorRating( input );
  let co2sr = getCO2ScubberRating( input );

  answer = ogr * co2sr;
  
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
