"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "target area: x=20..30, y=-10..-5"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/


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
  let matches = lines[0].match( /^target area: x=(\d+)\.\.(\d+), y=(-?\d+)\.\.(-?\d+)$/ );

  let target_area = {
    from:   [ parseInt( matches[1] ), parseInt(matches[3] ) ],
    to:     [ parseInt(matches[2] ), parseInt( matches[4] ) ]
  }
  
  log( target_area );

  return( target_area );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function isProbeInTargetArea( x, y, target_area ) {
  return( x >= target_area.from[0] && x <= target_area.to[0] && y >= target_area.from[1] && y <= target_area.to[1] );
}


function fireProbe( x_start_velocity, y_start_velocity, target_area ) {
  let x = 0;
  let y = 0;

  log( `Firing probe: ${x_start_velocity}, ${y_start_velocity}` );

  let x_velocity = x_start_velocity;
  let y_velocity = y_start_velocity;

  let max_y = -Infinity;

  let past_target = false;

  while( !past_target ) {
    x += x_velocity;
    y += y_velocity;

    // log( `Iteration - at: ${x}, ${y}, velocity: ${x_velocity}, ${y_velocity}` );

    if( y > max_y ) {
      max_y = y;
    }

    if( isProbeInTargetArea( x, y, target_area ) ) {
      log( `max height: ${max_y}` );
      return( max_y );
    }

    past_target = x > target_area.to[0] || y < target_area.from[1];

    if( x_velocity ) {
      x_velocity--;
    }

    y_velocity--;
  }

  return( -Infinity );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, target_area ) {
  let answer = 0;

  let max_x_velocity = target_area.to[0];
  let min_y_velocity = target_area.from[1];

  // calculate min x velocity

  let min_x_velocity = 1;

  while( min_x_velocity * ( min_x_velocity + 1 ) / 2 < target_area.from[0] ) {  // Use sum of integers for this
    min_x_velocity++;
  }

  let max_y_velocity = Math.abs( target_area.from[1] );    

  let max_height = -Infinity;

  for( let x_velocity = min_x_velocity; x_velocity <= max_x_velocity; x_velocity++ ) {
    let y_velocity = min_y_velocity;

    let done = false;

    while( !done ) {
      let height = fireProbe( x_velocity, y_velocity, target_area );

      if( height > max_height ) {
        max_height = height;
      }

      y_velocity++;

      done = y_velocity > max_y_velocity;

    }
  }

  answer = max_height;

  console.log( `Non brute force solution: ${target_area.from[1] * ( target_area.from[1] + 1 ) /2}` );  // Non-brute force solution

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, target_area ) {
  let answer = 0;

  let max_x_velocity = target_area.to[0];
  let min_y_velocity = target_area.from[1];

  // calculate min x velocity

  let min_x_velocity = 1;

  while( min_x_velocity * ( min_x_velocity + 1 ) / 2 < target_area.from[0] ) {  // Use sum of integers for this
    min_x_velocity++;
  }

  let max_y_velocity = Math.abs( target_area.from[1] );    

  let hits = 0;

  for( let x_velocity = min_x_velocity; x_velocity <= max_x_velocity; x_velocity++ ) {
    let y_velocity = min_y_velocity;

    let done = false;

    while( !done ) {
      let height = fireProbe( x_velocity, y_velocity, target_area );

      if( height != -Infinity ) {
        hits++;
      }

      y_velocity++;

      done = y_velocity > max_y_velocity;

    }
  }

  answer = hits;
  
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
