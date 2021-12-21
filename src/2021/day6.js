"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "3,4,3,1,2"
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

    let fish = line.split( ',' ).map( f => parseInt( f ) );

    parsed.push( ...fish );
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

  let days = 80;

  let fishes = _.cloneDeep( input );

  for( let day = 1; day <= days; day++ ) {
    let add_fish = 0;

    for( let i = 0; i < fishes.length; i++ ) {
      if( !fishes[i] ) {
        add_fish++;
        fishes[i] = 6;
      } else {
        fishes[i]--;
      }
    }

    for( let j = 0; j < add_fish; j++ ) {
      fishes.push( 8 );
    }

    log( fishes );
  }

  answer = fishes.length;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  // Can't use brute force/array approach from part 1 since we'll out of memory....so use an approach based on modulo arithmetic

  let timers = {};

  // Set up the initial timers we got in input
  
  for( let i = 0; i < input.length; i++ ) {
    let timer = input[i]

    if( !timers[timer] ) {
      timers[timer] = 1;
    } else {
      timers[timer]++;
    }
  }

  // log( timers );

  let days = 256;

  let add_fish = 0;

  for( let day = 1; day <= days; day++ ) {
    let add_fish_next_day = 0;

    for( let timer of Object.keys( timers ).map( t => parseInt( t ) ) ) {
      let count  = timers[timer];

      if( timer < 7 ) {
        if( ( day % 7 ) == timer ) {  // If timer is at 0, then we need to add another fish the next day
          add_fish_next_day += count;
        }
      } else {
        delete timers[timer];

        timer--;

        if( timer == 6 ) {
          timer = ( day - 1 ) % 7;    // Once timer drops to 6, figure out the modulo based on the day and repeating every 7 days

          if( !timers[timer] ) {
            timers[timer] = count;
          } else {
            timers[timer] += count;
          }
        } else {
          timers[timer] = count;
        }
      }
    }

    if( add_fish ) {
      timers[8] = add_fish;
    }

    add_fish = add_fish_next_day;

    log( `End of Day ${day} - ${JSON.stringify( timers )}` );
  }

  for( let timer of Object.keys( timers ) ) {
    answer += timers[timer];
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
