"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "6,10",
  "0,14",
  "9,10",
  "0,3",
  "10,4",
  "4,11",
  "6,0",
  "6,12",
  "4,1",
  "0,13",
  "10,12",
  "3,4",
  "3,0",
  "8,4",
  "1,10",
  "2,14",
  "8,10",
  "9,0",
  "",
  "fold along y=7",
  "fold along x=5"
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
  let paper = new Set();
  let folds = [];

  for( let line of lines ) {

    if( line.length ) {
      if( line.startsWith( "fold along " ) ) {
        let fold = line.split( " " )[2].split( "=" );

        folds.push( { axis: fold[0], line: parseInt( fold[1] ) } );
      } else {
        paper.add( line );
      }
    }
  }
  
  log( paper );
  log( folds )

  return( [ paper, folds ] );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function displayPaper( paper ) {
  let max_x = -Infinity;
  let max_y = -Infinity;

  for( let dot of paper ) {
    let dot_xy = dot.split( "," ).map( v => parseInt( v ) );

    if( dot_xy[0] > max_x ) {
      max_x = dot_xy[0];
    }

    if( dot_xy[1] > max_y ) {
      max_y = dot_xy[1];
    }
  }

  let grid = [];

  for( let y = 0; y <= max_y; y++ ) {
    grid.push( new Array( max_x  + 1 ).fill( " " ) );
  }

  for( let dot of paper ) {
    let dot_xy = dot.split( "," ).map( v => parseInt( v ) );

    grid[ dot_xy[1] ][ dot_xy[0] ] = "#";
  }

  for( let y = 0; y <= max_y; y++ ) {
    console.log( grid[y].join( ' ' ) );
  }
}


function foldPaper( paper, fold ) {
  let folded = new Set();

  let fold_axis  = fold.axis == "x" ? 0 : 1;
  let other_axis = fold.axis == "x" ? 1 : 0;
  let fold_line  = fold.line;

  for( let dot of paper ) {
    let dot_xy = dot.split( "," ).map( v => parseInt( v ) );

    if( dot_xy[ fold_axis ] < fold_line ) {
      folded.add( dot );
    } else if( dot_xy[ fold_axis ] > fold_line ) {
      let folded_dot = [ 0, 0 ];

      folded_dot[ fold_axis ]  = fold_line * 2 - dot_xy[ fold_axis ];
      folded_dot[ other_axis ] = dot_xy[ other_axis ];

      if( folded_dot[ fold_axis ] < 0 ) {
        console.log( `Crapstix: fold goes negative!!! `);
      }

      folded.add( folded_dot.join( "," ) );
    }
  }

  return( folded );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, paper, folds ) {
  let answer = 0;

  let folded = foldPaper( paper, folds[0] );

  displayPaper( folded );

  answer = folded.size;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, paper, folds ) {
  let folded = paper;

  for( let fold of folds ) {
    folded = foldPaper( folded, fold );
  }

  console.log();

  displayPaper( folded );

  console.log();
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

PART == "1" ? part1( DAY, ...PARSED ) : part2( DAY, ...PARSED );
