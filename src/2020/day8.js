"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "nop +0",
  "acc +1",
  "jmp +4",
  "acc +3",
  "jmp -3",
  "acc -99",
  "acc +1",
  "jmp -4",
  "acc +6",
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {
    let instruction = line.split( " " );

    parsed.push( [ instruction[ 0 ], Number( instruction[1] ) ] );
  }
  
  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function executeInstruction( program, loc, accumulator ) {
  let new_loc;
  let new_acc = accumulator;;

  let [ instruction, quantifier ] = program[ loc ];

  switch( instruction ) {
    case "nop":
      new_loc = loc + 1;
      break;

    case "acc":
      new_acc = accumulator + quantifier;
      new_loc = loc + 1;
      break;

    case "jmp":
      new_loc = loc + quantifier;
    break;
  }

  return( [ new_loc, new_acc ] );
}


function executeProgram( program ) {
  let loc         = 0;
  let accumulator = 0;
  let executed    = [ 0 ];

  while( true ) {
    let [ new_loc, new_acc ] = executeInstruction( program, loc, accumulator );

    loc         = new_loc;
    accumulator = new_acc;

    if( executed.includes( loc ) || loc >= program.length ) {
      break;
    }

    executed.push( loc );
  }

  return( [ accumulator, loc ] );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let [ accumulator, loc ] = executeProgram( input );

  console.log( `Day ${day} answer, part 1: ${accumulator}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let accumulator = 0;

  let chg   = 0;
  let done  = false;

  while( !done ) {
    let instruction = input[ chg ];
    let results;

    switch( instruction[0] ) {
      case "acc":
        break;
  
      case "nop":
        instruction[0]  = "jmp";
        results         = executeProgram( input );

        if( results[1] == input.length ) {
          accumulator = results[0];
          done = true;
        }

        instruction[0] = "nop";
        break;
  
      case "jmp":
        instruction[0]  = "nop";
        results         = executeProgram( input );

        if( results[1] == input.length ) {
          accumulator = results[0];
          done = true;
        }

        instruction[0] = "jmp";
      break;
    }

    chg++;

    if( chg >= input.length ) {
      console.log( `CRAPSTIX: End of input without a solution!`)
      done = true;
    }
  }

  console.log( `Day ${day} answer, part 2: ${accumulator}` );
 }


/************************************************************************************
 * 
 * Main
 * 
 ************************************************************************************/

const PART    = process.argv[2];
const TEST    = process.argv[3];

let input;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );