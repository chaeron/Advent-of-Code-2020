"use strict";

const fs  = require( 'fs' );
const { zip, min } = require('lodash');
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "sesenwnenenewseeswwswswwnenewsewsw",
  "neeenesenwnwwswnenewnwwsewnenwseswesw",
  "seswneswswsenwwnwse",
  "nwnwneseeswswnenewneswwnewseswneseene",
  "swweswneswnenwsewnwneneseenw",
  "eesenwseswswnenwswnwnwsewwnwsene",
  "sewnenenenesenwsewnenwwwse",
  "wenwwweseeeweswwwnwwe",
  "wsweesenenewnwwnwsenewsenwwsesesenwne",
  "neeswseenwwswnwswswnw",
  "nenwswwsewswnenenewsenwsenwnesesenew",
  "enewnwewneswsewnwswenweswnenwsenwsw",
  "sweneswneswneneenwnewenewwneswswnese",
  "swwesenesewenwneswnwwneseswwne",
  "enesenwswwswneneswsenwnewswseenwsese",
  "wnwnesenesenenwwnenwsewesewsesesew",
  "nenewswnwewswnenesenwnesewesw",
  "eneswnwswnwsenenwnwnwwseeswneewsenese",
  "neswnwewnwnwseenwseesewsenwsweewe",
  "wseweeenwnesenwwwswnew"
]

let INPUT_TEST2 = [
  "nwwswee"
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
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {

    let matches = line.matchAll( /se|sw|ne|nw|e|w/g );

    let entry = [...matches].map( v => v[0]);

    parsed.push( entry );
  }
  
  // log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Classes
 * 
 ************************************************************************************/

// Solution uses cube coordinates for the hexagonal tiles per this: https://www.redblobgames.com/grids/hexagons/#coordinates

const DIRECTION_COORDINATES = {  // [ x, y, z ] offsets
  "se": [ 0, -1, 1 ], 
  "sw": [ -1, 0, 1 ], 
  "ne": [ 1, 0, -1 ], 
  "nw": [ 0, 1, -1 ], 
  "e":  [ 1, -1, 0 ], 
  "w":  [ -1, 1, 0 ], 
}

class Floor {
  constructor() {
    this.tiles = new Map();
  }


  getKey = function( coordinates ) {
    return( coordinates.join( "," ) );
  }


  getAdjacentCoordinates = function( coordinates, direction ) {
    let adjacent = [ ...coordinates ];

    let offsets = DIRECTION_COORDINATES[ direction ];

    adjacent[0] += offsets[0];
    adjacent[1] += offsets[1];
    adjacent[2] += offsets[2];

    return( adjacent );
  }


  flip = function( coordinates ) {
    let key = this.getKey( coordinates );
      
    if( this.tiles.has( key ) ) {
      this.tiles.delete( key );
    } else {
      this.tiles.set( key, coordinates );
    }
  }


  walkAndFlip( directions ) {
    let coordinates = [ 0, 0, 0 ];    // Centre

    for( let direction of directions ) {
      coordinates = this.getAdjacentCoordinates( coordinates, direction );
    }

    this.flip( coordinates );
  }


  getBlackCount = function() {
    return( this.tiles.size );
  }


  evolveTiles = function() {

    // First get our maximum coordinate values

    let min_max = [
      [ Infinity, -Infinity ],    // x, min, max
      [ Infinity, -Infinity ],    // y, min, max
      [ Infinity, -Infinity ]     // z, min, max
    ]

    for( let coordinates of this.tiles.values() ) {
      for( let i = 0; i < 3; i++ ) {
        if( coordinates[i] > min_max[i][1] ) {
          min_max[i][1] = coordinates[i];
        }

        if( coordinates[i] < min_max[i][0] ) {
          min_max[i][0] = coordinates[i];
        }
      }
    }

    let next_floor = new Floor();

    next_floor.tiles = new Map( this.tiles );

    // Now loop through all tiles that we have to check

    for( let x = min_max[0][0] - 3; x < min_max[0][1] + 3; x++ ) {
      for( let y = min_max[1][0] - 3; y < min_max[1][1] + 3; y++ ) {
        for( let z = min_max[2][0] - 3; z < min_max[2][1] + 3; z++ ) {  
          if( x + y + z == 0 ) {
            let adjacent_count = 0;

            for( let offset of Object.values( DIRECTION_COORDINATES ) ) {
              if( this.tiles.has( this.getKey( [ x + offset[0], y + offset[1], z + offset[2] ] ) ) ) {
                adjacent_count++;
              }
            }

            // Apply Game of Life mortality rules to next floor

            let key = this.getKey( [ x, y, z ] );

            if( this.tiles.has( key ) ) {
              if( adjacent_count == 0 || adjacent_count > 2 ) {
                next_floor.tiles.delete( key );
              }
            } else {
              if( adjacent_count == 2 ) {
                next_floor.tiles.set( key, [ x, y, z ] );
              }
            }
          }
        }
      }
    }

    return( next_floor );
  }


}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, input ) {
  let answer = 0;

  let floor = new Floor();

  for( let directions of input ) {
    floor.walkAndFlip( directions );
  }

  answer = floor.getBlackCount();

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let floor = new Floor();

  for( let directions of input ) {
    floor.walkAndFlip( directions );
  }

  log( `Day: 0, Blacks: ${floor.getBlackCount()}` );

  for( let day = 1; day <= 100; day++ ) {
    floor = floor.evolveTiles();

    log( `Day: ${day}, Blacks: ${floor.getBlackCount()}` );
  }

  answer = floor.getBlackCount();

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
