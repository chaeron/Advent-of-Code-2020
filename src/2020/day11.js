"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
"L.LL.LL.LL",
"LLLLLLL.LL",
"L.L.L..L..",
"LLLL.LL.LL",
"L.LL.LL.LL",
"L.LLLLL.LL",
"..L.L.....",
"LLLLLLLLLL",
"L.LLLLLL.L",
"L.LLLLL.LL",
]


const INPUT_REAL = fs.readFileSync( './src/2020/data/day11.data' ).toString().split( "\n" );


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {
    let entry = line.split( "" );

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

 function getVisible( seats, i, j, ys, xs, adjacent ) {
  let seat = null;

  let y = ys;
  let x = xs;

  while( seat == null ) {
    if( i + y >= 0 && i + y < seats.length && j + x >= 0 && j + x < seats[0].length ) {
      if( seats[i + y][j + x] == "." && !adjacent ) {
        y += ys;
        x += xs;
      } else {
        seat = seats[i + y][j + x];
      }
    } else {
      seat = "-";
    }
  }

  return( seat );
 }


 function geOccupiedCount( seats, i, j, adjacent ) {
  let count = 0;

  for( let y of [ -1, 0, 1 ]) {
    for( let x of [ -1, 0, 1 ] ) { 
      if( !( y == 0 && x == 0 ) ) {
        let visible = getVisible( seats, i, j, y, x, adjacent );

        if( visible == "#" ) {
          count++;
        }
      }
    }
  }

  return( count );
 }



function processSeat( seats, i, j, changed_seats, check_occupied, adjacent ) {
  let changed = false;

  let occupied = geOccupiedCount( seats, i, j, adjacent );

  // console.log( `processing seat: ${i}, ${j}, is: ${seats[i][j]}, occupied; ${occupied}` );

  switch( seats[i][j] ) {
    case ".":
      break;

    case "L":
      if( occupied == 0 ) {
        changed_seats[i][j] = "#";
        changed = true;
      }
      break;

    case "#":
      if( occupied >= check_occupied ) {
        changed_seats[i][j] = "L";
        changed = true;
      }
      
      break;
  }

  return( changed );
}


function processRound( seats, check_occupied, adjacent ) {
  let changed = false;

  let changed_seats = _.cloneDeep( seats );

  for( let i = 0; i < seats.length; i++ ) {
    for( let j = 0; j < seats[0].length; j++ ) {
      if( processSeat( seats, i, j, changed_seats, check_occupied, adjacent ) ) {
        changed = true;
      }
    }
  }

  return( [ changed, changed_seats ] );
}


function executePuzzle( input, check_occupied, adjacent ) {
  let done = false;
  let rounds = 0;

  let seats = input;

  while( !done ) {
    let [ changed, changed_seats ] = processRound( seats, check_occupied, adjacent );

    seats = changed_seats;

    if( changed ) {
      rounds++;
    } else {
      done = true;
    }
  }

  let occupied = 0;

  for( let i = 0; i < seats.length; i++ ) {
    for( let j = 0; j < seats[0].length; j++ ) {
      if( seats[i][j] == "#" ) {
        occupied++;
      }
    }
  }

  return( occupied )
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
 
  let answer = executePuzzle( input, 4, true );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = executePuzzle( input, 5, false );

  
  console.log( `Day ${day} answer, part 2: ${answer}` );
 }


/************************************************************************************
 * 
 * Main
 * 
 ************************************************************************************/

const PART    = process.argv[2];
const TEST    = process.argv[3];

const DAY     = 11;

let input;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
