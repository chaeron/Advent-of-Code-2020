"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "389125467"
]


const DAY = process.argv[1].match( /day(\d*)b\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );


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
 * Classes
 * 
 ************************************************************************************/

 // Alternative solution using an integer array as an implicit linked list.
 // Since all we need to track is a cup's next value, we keep the next value in the array and we don't need the cup value as it's implicitly the index into the node_list array
 // This version runs a bit faster than the full linked list version, but not that much faster, 5.2 seconds vs 6.5 for the Part 2 final answer

class Cups {
  constructor( elements, max = 9, pickup_count = 3 ) {
    this.current      = null;
    this.pickup_count = pickup_count;
    this.max          = max;
    this.node_list    = new Array( max + 1 );

    this.current      = elements[0];

    this.node_list[ this.current ] = this.current;

    let prev          = this.current;
    
    // Add the cups

    for( let i = 1 ; i < elements.length; i++ ) {
      let next = elements[i];

      this.node_list[ next ] = this.node_list[ prev ];
      this.node_list[ prev ] = next;

      prev = next;
    }

    // Add up to max extra cups for Part 2

    if( max > 9 ) {
      for( let next = 10 ; next <= max; next++ ) {
        this.node_list[ next ] = this.node_list[ prev ];
        this.node_list[ prev ] = next;

        prev = next;
      }
    }
  }

  toArray = function( from_value = null, quantity = 0 ) { // Quantity of items to return, for Part 2 so we don't return a million entries!
    let arr  = [];
    let done = false;

    let node;

    if( from_value == null ) {
      node = this.current;
    } else {
      node = from_value;
    }

    let count = 1;
    let max   = this.max;

    if( quantity ) {
      max = quantity;
    }

    while( !done ) {
      arr.push( node );
      node = this.node_list[ node ];

      count++

      if( count > max ) {
        done = true;
      }
    }

    return( arr );
  }


  #pickup = function() {
    let start = this.node_list[ this.current ];

    let end = start;

    for( let i = 0; i < this.pickup_count - 1; i++ ) {
      end = this.node_list[ end ];
    }

    this.node_list[ this.current ] = this.node_list[ end ];

    this.node_list[ end ] = null;

    return( [ start, end ] );
  }


  #getDestinationNode = function( picked ) {
    let dest = this.current - 1;

    if( dest == 0 ) {
      dest = this.max;
    }

    while( picked.includes( dest ) ) {
      dest = dest - 1;

      if( dest == 0 ) {
        dest = this.max;
      }
    }

    log( `destination: ${dest}` );

    return( dest );
  }


  move = function() {
    let [ picked_start, picked_end ] = this.#pickup();  // Get the picked up cups linked list fragment

    let picked_arr = [];

    let picked = picked_start;

    while( picked ) {
      picked_arr.push( picked );
      picked = this.node_list[ picked ];
    }

    log( `pick up: ${picked_arr}` );

    let destination = this.#getDestinationNode( picked_arr );

    // splice the picked up cups linked list fragment into the destination location

    this.node_list[ picked_end ] = this.node_list[ destination ];
    this.node_list[ destination ] = picked_start;

    this.current = this.node_list[ this.current ];
  }

}


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = lines[0].split( "" ).map( v => Number( v ) );
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let cups = new Cups( input );

  for( let i = 0; i < 100; i++ ) {
    log( `cups: ${cups.toArray()}` );

    cups.move();
  }

  answer = cups.toArray( 1 ).slice( 1 ).join( "" );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let cups = new Cups( input, 1000000 );

  for( let i = 0; i < 10000000; i++ ) {
    cups.move();
  }

  let final_cups = cups.toArray( 1, 3 );

  console.log( `Final cups: ${final_cups}` );

  answer = final_cups[1] * final_cups[2];
  
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

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
