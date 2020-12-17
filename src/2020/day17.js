"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  ".#.",
  "..#",
  "###",
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines, iterations ) {
  let parsed = [];

  // Using a Map with "x,y,z,w" as keys would have worked just as well and might have been more "understandable". See day17b.js for a more generic solution using a class and maps

  let max_dim = lines.length + 2 + ( 2 * iterations );    // Build array bigger than necessary so that we don't have to worry about negative indexes and it's sized big enough for the number of expected iterations

  // create board

  let board = new Array( max_dim );
  
  for( let x = 0; x < max_dim; x++ ) {
    board[x] = new Array( max_dim );

    for( let y = 0; y < max_dim; y++ ) {
      board[x][y] = new Array( max_dim );

      for( let z = 0; z < max_dim; z++ ) {
        board[x][y][z] = new Array( max_dim );
      }
    }
  }

  for( let i = lines.length - 1; i >= 0; i--  ) {
    let line = lines[i];

    let values = line.split( "" );

    for( let x = 0; x < values.length; x++ ) {
      if( values[x] == "#" ) {
        board[ x + iterations + 1][i + iterations + 1][iterations + 1][iterations + 1] = 1;  // Offset the starting values so that we don't have to worry about negative indexes or going out of bounds
      }
    }

  }
  
  // console.log( JSON.stringify( board, null, 2 ) );

  return( board );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

const OFFSETS = [ -1, 0, 1 ];

function getAdjacentCount( board, x, y, z, w ) {
  let count = 0;

  for( let xoffset of OFFSETS ) {
    for( let yoffset of OFFSETS ) {
      for( let zoffset of OFFSETS ) {
        for( let woffset of OFFSETS ) {
          if( xoffset != 0 || yoffset != 0 || zoffset != 0 || woffset != 0 ) {
            if( board[x + xoffset][y + yoffset][z + zoffset][w + woffset] ) {
              count++;
            }
          }
        }
      }
    }
  }

  return( count );
}


function playIteration( board, dimensions ) {
  let new_board = _.cloneDeep( board );

  for( let x = 1; x < board.length - 1; x++ ) {
    let ys = board[x];

    for( let y = 1; y < ys.length - 1; y++ ) {
      let zs = ys[y];

      for( let z = 1; z < zs.length - 1; z++ ) {
        let ws = zs[z];

        let w_start = 1;
        let w_end   = ws.length - 1;

        if( dimensions == 3 ) {
          w_start = 7;                // iterations + 1 for 3D (fixed w dimension)
          w_end   = w_start + 1;
        }

        for( let w = w_start; w < w_end; w++ ) {                                 
          let adjacentCount = getAdjacentCount( board, x, y, z, w );

          if( ws[w] && !( adjacentCount == 2 || adjacentCount == 3 ) ) {
            new_board[x][y][z][w] = undefined;
          } else if( !ws[w] && adjacentCount == 3 ) {
            new_board[x][y][z][w] = 1;
          }
        }
      }
    }
  }
  
  return( new_board )
}


function countActive( board ) {
  let count = 0;

  for( let x = 0; x < board.length; x++ ) {
    let ys = board[x];

    for( let y = 0; y < ys.length; y++ ) {
      let zs = ys[y];

      for( let z = 0; z < zs.length; z++ ) {
        let ws = zs[z];

        for( let w = 0; w < ws.length; w++ ) {
          if( ws[w] ) {
            count++;
          }
        }
      }
    }
  }

  return( count );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input, iterations ) {
  let answer = 0;

  let board = input;

  for( let iteration = 0; iteration < iterations; iteration++ ) {
    board = playIteration( board, 3 );
  }

  answer = countActive( board );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input, iterations ) {
  let answer = 0;

  let board = input;

  for( let iteration = 0; iteration < iterations; iteration++ ) {
    board = playIteration( board, 4 );
  }

  answer = countActive( board );

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

const ITERATIONS = 6;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input, ITERATIONS );

PART == "1" ? part1( DAY, PARSED, ITERATIONS ) : part2( DAY, PARSED, ITERATIONS );
