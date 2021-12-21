"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "[({(<(())[]>[[{[]{<()<>>",
  "[(()[<>])]({[<{<<[]>>(",
  "{([(<{}[<>[]}>{[]{[(<()>",
  "(((({<>}<{<{<>}{[]{[]{}",
  "[[<[([]))<([[{}[[()]]]",
  "[{[{({}]{}}([{[{{{}}([]",
  "{<[[]]>}<{[{[{[]{()[[[]",
  "[<(<(<(<{}))><([]([]()",
  "<{([([[(<>()){}]>(<<{{",
  "<{([{{}}[<[[[<>{}]]]>[]]"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

const OPEN_CLOSE = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">"
}

const ILLEGAL_SCORES = {
  ")":   3,
  "]":   57,
  "}":   1197,
  ">":   25137
}

const INCOMPLETE_SCORES = {
  ")":   1,
  "]":   2,
  "}":   3,
  ">":   4
}



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

    let entry = line;

    parsed.push( entry );
  }
  
  // log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function my_func( program, loc, accumulator ) {
  

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  for ( let line of input ) {
    let queue = [];

    for( let char of line ) {
      if( OPEN_CLOSE[ char ] ) {
        queue.push( char );
      } else {
        if( queue.length ) {
          let opening_char = queue.pop();

          if( OPEN_CLOSE[ opening_char ] != char ) {
            answer += ILLEGAL_SCORES[ char ];
            break;
          }
        } else {
          break;
        }
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

function part2( day, input ) {
  let answer = 0;

  let completions = [];

  for ( let line of input ) {
    let queue = [];

    let corrupt = false;

    for( let char of line ) {
      if( OPEN_CLOSE[ char ] ) {
        queue.push( char );
      } else {
        if( queue.length ) {
          let opening_char = queue.pop();

          if( OPEN_CLOSE[ opening_char ] != char ) {
            corrupt = true;
            break;
          }
        } else {
          break;
        }
      }
    }

    if( !corrupt && queue.length ) {
      completions.push( queue.map( c => OPEN_CLOSE[c] ).reverse().join('') );
    }
  }

  let scores = [];

  for( let line of completions ) {
    let score = 0;

    for( let char of line ) {
      score = score * 5 + INCOMPLETE_SCORES[ char ];
    }

    scores.push( score );
  }

  scores.sort( (a, b) => a - b );

  answer = scores[ ( scores.length - 1 ) / 2 ]
  
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
