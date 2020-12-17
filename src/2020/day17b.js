"use strict";

const fs  = require( 'fs' );
const { first } = require('lodash');
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


const DAY = process.argv[1].match( /day(\d*)\S\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Class Definitions
 * 
 ************************************************************************************/

 // This solution is a generic one that will work for any dimension of Game of Life board. It uses a Map intenally for the board.
 //
 // It's slower (about 1.5x or so) than the array version (day17.js), which is expected using Maps and for a more generic solution.
 //
 // 

class GoLBoard {
  constructor( input ) {
    if( input instanceof GoLBoard ) {                   // Clone an existing board?
      this.dimensions  = input.dimensions;
      this.board       = _.cloneDeep( input.board );
    } else {
      this.dimensions  = input;
      this.board       = new Map();
    }
  }


  #getKey( ...location ) {
    let key = location.reduce( ( acc, cur ) => acc + "," + cur );

    return( key );
  }


  get( ...location ) {
    if( location.length != this.dimensions ) {
      throw( `Get argument count (${location.length}) != dimensions (${this.dimensions}) ` );
    }

    let key = this.#getKey( ...location );

    let val = this.board.get( key );

    return( val ? 1 : 0 );
  }


  set( val, ...location ) {
    if( location.length != this.dimensions ) {
      throw( `Set argument count (${location.length}) != dimensions (${this.dimensions}) ` );
    }

    let key = this.#getKey( ...location );

    if( val ) {
      this.board.set( key, val );
    } else {
      this.board.delete( key );
    }
  }


  countLivingCells() {
     return( this.board.size );
  }


  #getAdjacentCellLocs( ...location ) {
    let indexes = [];

    for( let offset of [ -1, 0, 1 ] ) {
      if( location.length == 1 ) {
        indexes.push( [ location[0] + offset ] );
      } else {
        let sub_indexes = this.#getAdjacentCellLocs( ...( location.slice( 1 ) ) );
        
        for( let sub of sub_indexes ) {
          let cell_index = [ location[0] + offset, ...sub ];

          let identical = location.find( ( v, idx ) => v != cell_index[idx] ) == undefined;   // Is the location identical to the cell_index? Skip if so....

          if( location.length != this.dimensions || !identical ) {
            indexes.push( cell_index );
          }
        }
      }
    }

    return( indexes );
  }


  #getAdjacentCount( ...location ) {
    let count = 0;

    let cellLocs = this.#getAdjacentCellLocs( ...location );

    for( let cellLoc of cellLocs ) {
      count += this.get( ...cellLoc );
    }

    return( count );
  }


  nextGeneration() {
    let new_board = new GoLBoard( this );

    let check_cells = new Map();

    // figure out what cells we need to check (basically every living cell and it's adjacents)

    for( let key of this.board.keys() ) {
      let location = key.split( "," ).map( v => Number( v ) );

      check_cells.set( key, location );

      let cellLocs = this.#getAdjacentCellLocs( ...location );

      for( let cellLoc of cellLocs ) {
        check_cells.set( this.#getKey( ...cellLoc ), cellLoc );
      }
    }

    // Go check each cell

    for( let location of check_cells.values() ) {
      let adjacentCount = this.#getAdjacentCount( ...location );

      let current = this.get( ...location );

      if( current && !( adjacentCount == 2 || adjacentCount == 3 ) ) {
        new_board.set( 0, ...location );
      } else if( !current && adjacentCount == 3 ) {
        new_board.set( 1, ...location );
      }
    }

    return( new_board );
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
    parsed.push( line.split( "" ).map( v => v == "#" ? 1 : 0 ) )
  }

  parsed.reverse();

  return( parsed );
}

/************************************************************************************
 * 
 * Puzzle Functions
 * 
 ************************************************************************************/

function initializeBoard( board, input ) {
  for( let y = 0; y < input.length; y++ ) {
    let xs = input[y];

    for( let x = 0; x < xs.length; x++) {
      let cellLoc = [ x, y ];

      for( let dim = 1; dim <= board.dimensions - 2; dim++ ) {
        cellLoc.push( 0 );
      }

      board.set( xs[x], ...cellLoc );
    }
  }
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, input, iterations ) {
  let answer = 0;

  let board = new GoLBoard( 3 );

  initializeBoard( board, input );

  for( let iteration = 0; iteration < iterations; iteration++ ) {
    board = board.nextGeneration();
  }

  answer = board.countLivingCells();

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input, iterations ) {
  let answer = 0;

  let board = new GoLBoard( 4 );

  initializeBoard( board, input );

  for( let iteration = 0; iteration < iterations; iteration++ ) {
    board = board.nextGeneration();
  }

  answer = board.countLivingCells();

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

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED, ITERATIONS ) : part2( DAY, PARSED, ITERATIONS );
