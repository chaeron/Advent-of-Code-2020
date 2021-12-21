"use strict";

const fs  = require( 'fs' );
const { get } = require('lodash');
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "2199943210",
  "3987894921",
  "9856789892",
  "8767896789",
  "9899965678"
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
  [ 0, 1 ]
]


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

    let row = line.split( '' ).map( x => parseInt( x ) );

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

function getHeightWithDefault( arr, row, col, default_value ) {
  let value = default_value;

  if( row >= 0 && row < arr.length && col >= 0 && col < arr[0].length ) {
    value = arr[row][col];
  }

  return( value );
}


function isLowPoint( heightmap, row, col ) {
  let low = true;

  for( let offset of OFFSETS ) {
    let adjacent = getHeightWithDefault( heightmap, row + offset[0], col + offset[1], Infinity );

    if( heightmap[row][col] >= adjacent ) {
      low = false;
      break;
    }
  }

  // if( low ) {
  //   log( `Low: [${row},${col}]` );
  // }

  return( low );
}


function getAdjacentBasinPoints( heightmap, row, col, basin_points ) {
  for( let offset of OFFSETS ) {
    let adjacent = getHeightWithDefault( heightmap, row + offset[0], col + offset[1], null );

    if( ![ 9, null ].includes( adjacent ) && heightmap[row][col] < adjacent ) {
      // Adjacent is higher

      let adjacent_point = [row + offset[0], col + offset[1] ];
      
      if( !basin_points.some( pt => _.isEqual( pt, adjacent_point ) ) ) {   // Make sure we haven't already processed this adjacent point!
        basin_points.push( adjacent_point );
        getAdjacentBasinPoints( heightmap, row + offset[0], col + offset[1], basin_points );
      }
    }
  }
}


function getBasinSize( heightmap, row, col ) {
  let size = 1;

  let basin_points = [ [row, col] ];

  getAdjacentBasinPoints( heightmap, row, col, basin_points );

  return( basin_points.length );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, heightmap ) {
  let answer = 0;

  for( let row = 0; row < heightmap.length; row++ ) {
    for( let col = 0; col < heightmap[row].length; col++ ) {
      if( isLowPoint( heightmap, row, col ) ) {
        answer += heightmap[row][col] + 1;
      }
    }
  }

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, heightmap ) {
  let answer = 0;

  let basin_sizes = [];

  for( let row = 0; row < heightmap.length; row++ ) {
    for( let col = 0; col < heightmap[row].length; col++ ) {
      if( isLowPoint( heightmap, row, col ) ) {
        let basin_size = getBasinSize( heightmap, row, col );

        log( `Low: [${row},${col}], basin size: ${basin_size}` );

        basin_sizes.push( basin_size );
      }
    }
  }

  basin_sizes.sort( (a, b) => b - a );

  log( basin_sizes );

  answer = basin_sizes[0] * basin_sizes[1] * basin_sizes[2];
  
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
