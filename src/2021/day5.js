"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );
const { setUncaughtExceptionCaptureCallback } = require('process');

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "0,9 -> 5,9",
  "8,0 -> 0,8",
  "9,4 -> 3,4",
  "2,2 -> 2,1",
  "7,0 -> 7,4",
  "6,4 -> 2,0",
  "0,9 -> 2,9",
  "3,4 -> 1,4",
  "0,0 -> 8,8",
  "5,5 -> 8,2"
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

    let matched = line.match( /^(\d+),(\d+)\s->\s(\d+),(\d+)$/ );

    let entry = {
      from:   { x: parseInt( matched[1] ), y: parseInt( matched[2] ) },
      to:     { x: parseInt( matched[3] ), y: parseInt( matched[4] ) }
    };

    parsed.push( entry );
  }
  
  // log( JSON.stringify( parsed, null, 2 ) );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function setPoint( x, y, points ) {
  let point = `${x},${y}`;

  if( points[ point ] == undefined ) {
    points[ point ] = 1;
  } else {
    points[ point ]++;
  }

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let points = {};

  for( let entry of input ) {
    if( entry.from.x == entry.to.x ) {
      let from_y = entry.from.y <= entry.to.y ? entry.from.y : entry.to.y;
      let to_y   = entry.from.y <= entry.to.y ? entry.to.y : entry.from.y;

      for( let y = from_y; y <= to_y; y++ ) {
        setPoint( entry.from.x, y, points );
      }

    } else if( entry.from.y == entry.to.y ) {
      let from_x = entry.from.x <= entry.to.x ? entry.from.x : entry.to.x;
      let to_x   = entry.from.x <= entry.to.x ? entry.to.x : entry.from.x;

      for( let x = from_x; x <= to_x; x++ ) {
        setPoint( x, entry.from.y, points );
      }
    }
  }

  // log( JSON.stringify( points, null, 2 ) );

  for( let point of Object.keys( points ) ) {
    if( points[point] >= 2 ) {
      answer++;
    }
  }

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let points = {};

  for( let entry of input ) {
    if( entry.from.x == entry.to.x ) {
      let from_y = entry.from.y <= entry.to.y ? entry.from.y : entry.to.y;
      let to_y   = entry.from.y <= entry.to.y ? entry.to.y : entry.from.y;

      for( let y = from_y; y <= to_y; y++ ) {
        setPoint( entry.from.x, y, points );
      }

    } else if( entry.from.y == entry.to.y ) {
      let from_x = entry.from.x <= entry.to.x ? entry.from.x : entry.to.x;
      let to_x   = entry.from.x <= entry.to.x ? entry.to.x : entry.from.x;

      for( let x = from_x; x <= to_x; x++ ) {
        setPoint( x, entry.from.y, points );
      }
    } else {
      let x    = entry.from.x;
      let y    = entry.from.y;

      let x_increment = entry.from.x <= entry.to.x ? 1 : -1;
      let y_increment = entry.from.y <= entry.to.y ? 1 : -1;

      log( JSON.stringify( entry, null, 2 ) );

      let done = false;

      while( !done ) {
        log( `setting (${x},${y}))`);
        setPoint( x, y, points );

        if( x == entry.to.x ) {
          done = true;
        }

        x += x_increment;
        y += y_increment;
      }
    }
  }

  // log( JSON.stringify( points, null, 2 ) );

  for( let point of Object.keys( points ) ) {
    if( points[point] >= 2 ) {
      answer++;
    }
  }

  
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
