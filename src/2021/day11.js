"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "5483143223",
  "2745854711",
  "5264556173",
  "6141336146",
  "6357385478",
  "4167524645",
  "2176841721",
  "6882881134",
  "4846848554",
  "5283751526"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

 const OFFSETS = [  
  [ -1, 0 ],
  [ 1, 0 ],
  [ 0, -1 ],
  [ 0, 1 ],
  [ 1, 1 ],
  [ 1, -1 ],
  [-1, 1 ],
  [ -1, -1 ]
]

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

    let row = line.split('').map( e=> ( { energy: parseInt(e), flashed: false } ) );

    parsed.push( row );
  }
  
  // log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function increment( octopii ) {
  for( let row = 0; row < octopii.length; row++ ) {
    for( let col = 0; col < octopii[0].length; col++ ) {
      octopii[row][col].energy++;
    }
  }
}


function reset( octopii ) {
  for( let row = 0; row < octopii.length; row++ ) {
    for( let col = 0; col < octopii[0].length; col++ ) {
      if( octopii[row][col].energy > 9 ) {
        octopii[row][col].energy = 0;
        octopii[row][col].flashed = false;
      }
    }
  }
}


function flashAdjacent( octopii, row, col ) {
  let flashed = 0;

  for( let offset of OFFSETS ) {
    let r = row + offset[0];
    let c = col + offset[1];

    let octopus = null;

    try {
      octopus = octopii[r][c];
    }
    catch( e ) {}

    if( octopus ) {
      octopus.energy++;

      if( octopus.energy > 9 && !octopus.flashed ) {
        octopus.flashed++;
        flashed++;

        flashed += flashAdjacent( octopii, r, c );
      }
    }
  }

  return( flashed );
}


function flash( octopii ) {
  let flashed = 0;

  for( let row = 0; row < octopii.length; row++ ) {
    for( let col = 0; col < octopii[0].length; col++ ) {
      if( octopii[row][col].energy > 9 && !octopii[row][col].flashed  ) {
        octopii[row][col].flashed = true;
        flashed++;

        flashed += flashAdjacent( octopii, row, col );
      }
    }
  }

  return( flashed );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, octopii ) {
  let answer = 0;

  for( let step = 1; step <= 100; step++ ) {
    increment( octopii );

    answer += flash( octopii );

    reset( octopii );
  }

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, octopii ) {
  let answer = 0;

  let all_flashing = false;
  let step         = 0;

  while( !all_flashing ) {
    step++;

    increment( octopii );

    if( flash( octopii ) == 100 ) {
      break;
    }

    reset( octopii );
  }

  answer = step;
  
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
