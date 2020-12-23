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


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

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

class Node {
  constructor( value, next = null ){
    this.value   = value;
    this.next    = next;
  }
}

class Cups {
  constructor( elements, max = 9, pickup_count = 3 ) {
    this.current      = null;
    this.pickup_count = pickup_count;
    this.max          = max;
    this.find_nodes   = new Array( max + 1 );

    this.current      = new Node( elements[0] );

    this.find_nodes[ elements[0] ] = this.current;    // Cross reference so that we don't have to traverse the linked list to find a node, optimization for Part 2

    let prev          = this.current;
    
    // Add the cups

    for( let i = 1 ; i < elements.length; i++ ) {
      let next = new Node( elements[i], this.current );

      this.find_nodes[ elements[i] ] = next;

      prev.next = next;
      prev      = next;
    }

    // Add up to max extra cups for Part 2

    if( max > 9 ) {
      for( let i = 10 ; i <= max; i++ ) {
        let next = new Node( i, this.current );
  
        this.find_nodes[ i ] = next;
  
        prev.next = next;
        prev      = next;
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
      node = this.#findNode( from_value );
    }

    let count = 1;
    let max   = this.max;

    if( quantity ) {
      max = quantity;
    }

    while( !done ) {
      arr.push( node.value );
      node = node.next;

      count++

      if( count > max ) {
        done = true;
      }
    }

    return( arr );
  }


  #findNode = function( value ) {
    let node = this.find_nodes[ value ];

    return( node );
  }
  

  #pickup = function() {
    let start = this.current.next;

    let end = start;

    for( let i = 0; i < this.pickup_count - 1; i++ ) {
      end = end.next;
    }

    this.current.next = end.next;

    end.next = null;

    return( [ start, end ] );
  }


  #getDestinationNode = function( picked ) {
    let dest = null;

    let dest_value = this.current.value - 1;

    if( dest_value == 0 ) {
      dest_value = this.max;
    }

    while( picked.includes( dest_value ) ) {
      dest_value = dest_value - 1;

      if( dest_value == 0 ) {
        dest_value = this.max;
      }
    }

    dest = this.#findNode( dest_value );

    log( `destination: ${dest.value}` );

    return( dest );
  }


  move = function() {
    let [ picked_start, picked_end ] = this.#pickup();  // Get the picked up cups linked list fragment

    let picked_arr = [];

    let picked = picked_start;

    while( picked ) {
      picked_arr.push( picked.value );
      picked = picked.next;
    }

    log( `pick up: ${picked_arr}` );

    let destination = this.#getDestinationNode( picked_arr );

    // splice the picked up cups linked list fragment into the destination location

    picked_end.next = destination.next;
    destination.next = picked_start;

    this.current = this.current.next;
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
