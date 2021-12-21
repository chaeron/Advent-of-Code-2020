"use strict";

const fs            = require( 'fs' );
const _             = require( 'lodash' );
const { FibonacciHeap } = require( '@tyriar/fibonacci-heap' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "1163751742",
  "1381373672",
  "2136511328",
  "3694931569",
  "7463417111",
  "1319128137",
  "1359912421",
  "3125421639",
  "1293138521",
  "2311944581"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

 const OFFSETS = [  
  [ -1, 0 ],
  [ 1, 0 ],
  [ 0, -1 ],
  [ 0, 1 ]
]


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

  let row = 0;

  for( let line of lines ) {

    let entry = line.split( '' ).map( ( x, i ) => ( { row: row, col: i, risk: parseInt( x ), min_risk: Infinity } ) );

    parsed.push( entry );

    row++;
  }

  parsed[0][0].min_risk = 0;
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

 function getRiskWithDefault( row, col, cavern, default_value ) {
  let value = default_value;

  if( row >= 0 && row < cavern.length && col >= 0 && col < cavern[0].length ) {
    value = arr[row][col];
  }

  return( value );
}


function getAdjacentUnvisitedCavernPoints( row, col, cavern, unvisited ) {
  let adjacents = [];

  for( let offset of OFFSETS ) {
    if( getRiskWithDefault( row + offset[0], col + offset[1], cavern, null ) != null ) {
      let adjacent_point = [row + offset[0], col + offset[1] ];
        
        adjacents.push( adjacent_point );
    }
  }

  return( adjacents );
}


function determineDijkstraShortestPaths( unvisited, cavern ) {
  let node = unvisited.extractMinimum();

  let row = node.value[0];
  let col = node.value[1];

  let entry = cavern[row][col];

  // log( `Current: ${row},${col} ${JSON.stringify( entry)}` );

  let adjacents = getAdjacentUnvisitedCavernPoints( row, col, cavern, unvisited );

  // log( adjacents );

  for( let adjacent of adjacents ) {

    let adjacent_entry = cavern[ adjacent[0] ][ adjacent[1] ];

    // log( `Adjacent: ${adjacent[0]},${adjacent[1]} ${JSON.stringify( adjacent_entry)}` );

    let entry_min_risk = row || col ? entry.min_risk : 0;

    if( adjacent_entry.min_risk > entry_min_risk + adjacent_entry.risk ) {
      adjacent_entry.min_risk = entry_min_risk + adjacent_entry.risk;

      unvisited.decreaseKey( adjacent_entry.node, adjacent_entry.min_risk );
    }
  }
}


function cavern5X( cavern ) {
  let cavern_5x = Array( cavern.length * 5 );

  for( let row = 0; row < cavern.length * 5; row++ ) {
    let cols = [];

    cavern_5x[row] = cols;

    for( let col = 0; col < cavern.length * 5; col++ ) {
      let entry = _.cloneDeep( cavern[row % cavern.length][col % cavern.length] );

      log( `${row},${col} -> ${row % cavern.length},${col % cavern.length}, entry: ${cavern[row % cavern.length][col % cavern.length].risk}`)

      if( row != 0 || col != 0 ) {
        entry.risk = ( ( entry.risk - 1 + Math.floor( row / cavern.length ) + Math.floor( col / cavern.length ) ) % 9 ) + 1;
        entry.min_risk = Infinity;
      }

      cavern_5x[row].push( entry );
    }
  }

  log( cavern_5x[0] );

  return( cavern_5x );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, cavern ) {
  let answer = 0;

  let unvisited = new FibonacciHeap();

  // Initialize unvisited

  for( let row = 0; row < cavern.length; row++ ) {
    for( let col = 0; col < cavern[0].length; col++ ) {
      let entry = cavern[row][col];

      entry.node = unvisited.insert( entry.min_risk, [row, col] );
    }
  }

  // log( unvisited );

  while( !unvisited.isEmpty() ) {
    determineDijkstraShortestPaths( unvisited, cavern );
  }

  // Answer is the min_risk of end point

  answer = cavern[cavern.length - 1][cavern[0].length - 1].min_risk;  

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, cavern ) {
  let answer = 0;

  cavern = cavern5X( cavern );

  let unvisited = new FibonacciHeap();

  // Initialize unvisited

  for( let row = 0; row < cavern.length; row++ ) {
    for( let col = 0; col < cavern[0].length; col++ ) {
      let entry = cavern[row][col];

      entry.node = unvisited.insert( entry.min_risk, [row, col] );
    }
  }

  // log( unvisited );

  while( !unvisited.isEmpty() ) {
    determineDijkstraShortestPaths( unvisited, cavern );
  }

  // Answer is the min_risk of end point

  answer = cavern[cavern.length - 1][cavern[0].length - 1].min_risk;  

  
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
