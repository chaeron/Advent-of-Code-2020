"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
"7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1",
"",
"22 13 17 11  0",
" 8  2 23  4 24",
"21  9 14 16  7",
" 6 10  3 18  5",
" 1 12 20 15 19",
"",
" 3 15  0  2 22",
" 9 18 13 17  5",
"19  8  7 25 23",
"20 11 10 24  4",
"14 21 16 12  6",
"",
"14 21 17 24  4",
"10 16 15  9 19",
"18  8 23 26 20",
"22 11 13  6  5",
" 2  0 12  3  7",
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
  let board_num = -1;
  let line_num  = 0;
  let numbers;
  let boards = [];
  let board  = [];

  for( let line of lines ) {
    if( board_num < 0 ) {
      numbers = line.split( "," ).map( n => parseInt( n ) );
      board_num   = 0;
    } else {
      if( line.length ) {
        let board_line = line.split( " " ).filter( n => n != "" ).map( n => ( { number: parseInt( n ), marked: false } ) );

        board.push( board_line );
        line_num++;

        if( line_num == 5 ) {
          boards.push( board );

          board    = [];
          line_num = 0;
          board_num++;
        }
      }
    }
  }

  return( [ numbers, boards ] );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function isBoardWon( board ) {
  let won = false;

  for( let row = 0; row < 5; row++ ) {
    if( board[row][0].marked && board[row][1].marked && board[row][2].marked && board[row][3].marked && board[row][4].marked ) {
      won = true;
      break;
    }
  }

  if( !won ) {
    for( let col = 0; col < 5; col++ ) {
      if( board[0][col].marked && board[1][col].marked && board[2][col].marked && board[3][col].marked && board[4][col].marked ) {
        won = true;
        break;
      }
    }
  }

  return( won );
}


function markNumberOnBoard( number, board ) {
  for( let row = 0; row < 5; row++ ) {
    for( let col = 0; col < 5; col++ ) {
      if( board[row][col].number == number ) {
        board[row][col].marked = true;
      }
    }
  }
}


function getUnmarkedSum( board ) {
  let sum = 0;

  for( let row = 0; row < 5; row++ ) {
    for( let col = 0; col < 5; col++ ) {
      if( !board[row][col].marked ) {
        sum += board[row][col].number;
      }
    }
  }

  return( sum );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, numbers, boards ) {
  let answer = 0;

  let won = false;

  for( let number of numbers ) {
    if( !won ) {
      for( let board_num = 0; board_num < boards.length; board_num++ ) {
        let board = boards[board_num];

        markNumberOnBoard( number, board );

        if( isBoardWon( board ) ) {
          log( `winning number: ${number}, board: ${board_num}, sum: ${getUnmarkedSum( board )}`);
          log( JSON.stringify( board, null, 2 ))
          answer = number * getUnmarkedSum( board );
          won = true;
          break;
        }
      }
    } else {
      break;
    }
  }

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, numbers, boards ) {
  let answer = 0;

  let last_won_board;
  let last_won_board_num;
  let last_won_number;

  let board_won_count = 0;

  for( let number of numbers ) {
    if( board_won_count != boards.length ) {
      for( let board_num = 0; board_num < boards.length; board_num++ ) {
        let board = boards[board_num];

        if( !isBoardWon( board ) ) {
          markNumberOnBoard( number, board );

          if( isBoardWon( board ) ) {
            last_won_board     = _.cloneDeep( board );
            last_won_board_num = board_num;
            last_won_number    = number;
            board_won_count++;
          }

          if( board_won_count == boards.length ) {
            break;
          } 
        }
      }
    } else {
      break;
    }
  }

  log( `winning number: ${last_won_number}, board: ${last_won_board_num}, sum: ${getUnmarkedSum( last_won_board )}`);
  log( JSON.stringify( last_won_board, null, 2 ))

  answer = last_won_number * getUnmarkedSum( last_won_board );
  
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

PART == "1" ? part1( DAY, ...PARSED ) : part2( DAY, ...PARSED );
