"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]",
  "[[[5,[2,8]],4],[5,[[9,9],0]]]",
  "[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]",
  "[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]",
  "[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]",
  "[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]",
  "[[[[5,4],[7,7]],8],[[8,3],8]]",
  "[[9,3],[[9,9],[6,[4,9]]]]",
  "[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
  "[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]"
]



const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

// Two implementations, first using arrays and lots of fancy recursion. The second using strings and lots of regexes! ;-)
// Array implementation is faster than the string version! 

const USE_STRINGS = false;      // Pick which implementation to run!

const add          = USE_STRINGS ? addString : addArray;
const explode      = USE_STRINGS ? explodeString : explodeArray;
const split        = USE_STRINGS ? splitString : splitArray;
const getMagnitude = USE_STRINGS ? getMagnitudeString : getMagnitudeArray;


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

    let entry = USE_STRINGS ? line: JSON.parse( line );

    parsed.push( entry );
  }
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions - Both versions
 * 
 ************************************************************************************/

 function reduceSN( sn ) {
  let reduced_sn = sn;

  let was_exploded = explode( reduced_sn );

  // If string implmentation we get a new sn back. not a boolean, from explode or split so handle that differently

  if( typeof was_exploded == 'string' && was_exploded !== null ) {
    reduced_sn = was_exploded;
  }

  let was_split;

  if( !was_exploded ) {
    was_split = split( reduced_sn );

    if( typeof was_split == 'string' && was_split !== null ) {
      reduced_sn = was_split;
    }
  }

  if( was_exploded || was_split ) {
    reduced_sn = reduceSN( reduced_sn );
  }

  return( reduced_sn );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions - Array versions
 * 
 ************************************************************************************/

function addArray( sn1, sn2 ) {
  let sn = [ _.cloneDeep( sn1 ), _.cloneDeep( sn2 ) ];

  let reduced_sn = reduceSN( sn );

  return( reduced_sn );
}


function explodeArray( sn, nested = 1, parents = [] ) {
  let was_exploded = false;

  let snl = sn[0];
  let snr = sn[1];

  let lv = snl;
  let rv = snr;

  if( nested < 5 ) {
    if( typeof lv == "object" ) {
      was_exploded = explodeArray( lv, nested + 1, [ [ sn, "l" ], ...parents ] );      // Keep track of parent and which leg of parent we went down
    }

    if( !was_exploded ) {
      if( typeof rv == "object" ) {
        was_exploded = explodeArray( rv, nested + 1, [ [ sn, "r" ], ...parents ] );  // Keep track of parent and which leg of parent we went down
      }
    }
  } else {
    // we're 4 levels deep now, so lv and rv have to be integers at this point

    let parent_entry = parents[0];

    // set the exploding pair value to 0 in the parent

    if( parent_entry[1] == "l" ) {
      parent_entry[0][0] = 0;
    } else {
      parent_entry[0][1] = 0;
    }

    // left value is added to the first regular number to the left of the exploding pair (if any)

    let left_side = null;

    for( let i = 0; i < parents.length; i++ ) {
      if( parents[i][1] == "r" ) {
        left_side = parents[i][0];
        break;
      }
    }

    if( left_side ) {
      if( typeof left_side[0] != "object" ) {
        left_side[0] += lv;
      } else {
        // left side was a pair, so traverse down right side of that pair

        let pair = left_side[0];

        while( typeof pair[1] == "object" ) {
          pair = pair[1];
        }

        pair[1] += lv;
      }
    }

    // right value is added to the first regular number to the right of the exploding pair (if any)

    let right_side = null;

    // log( `parents: ${JSON.stringify( parents )}`)

    for( let i = 0; i < parents.length; i++ ) {
      if( parents[i][1] == "l" ) {
        right_side = parents[i][0];
        break;
      }
    }

    // log( `right side: ${JSON.stringify( right_side )}`)

    if( right_side ) {
      if( typeof right_side[1] != "object" ) {
        right_side[1] += rv;
      } else {
        // right side was a pair, so traverse down left side of that pair

        let pair = right_side[1];

        while( typeof pair[0] == "object" ) {
          pair = pair[0];
        }

        pair[0] += rv;
      }
    }
  }

  return( was_exploded );
}


function splitArray( sn ) {
  let was_split = false;

  let snl = sn[0];
  let snr = sn[1];

  let lv = snl;
  let rv = snr;

  if( typeof lv != "object" ) {
    if( lv >= 10 ) {
      sn[0] = [ Math.floor( lv / 2 ), Math.ceil( lv / 2 ) ];

      was_split = true;
    }
  } else {
    was_split = splitArray( lv );
  }

  if( !was_split ) {
    if( typeof rv != "object" ) {
      if( rv >= 10 ) {
        sn[1] = [ Math.floor( rv / 2 ), Math.ceil( rv / 2 ) ];

        was_split = true;
      }
    } else {
      was_split = splitArray( rv );
    }
  }

  return( was_split );
}


function getMagnitudeArray( sn ) {
  let snl = sn[0];
  let snr = sn[1];

  let lv = snl;
  let rv = snr;

  if( typeof snl == "object" ) {
    lv = getMagnitudeArray( snl );
  }

  if( typeof snr == "object" ) {
    rv = getMagnitudeArray( snr );
  }

  return( ( 3 * lv ) + ( 2 * rv ) );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions - String versions
 * 
 ************************************************************************************/

function addString( sn1, sn2 ) {
  let reduced_sn = reduceSN( `[${sn1},${sn2}]` );

  return( reduced_sn );
}

function explodeString( sn ) {
  let exploded_sn = null;

  let pair_index = null;
  let nested = 0;

  for( let i = 0; i < sn.length; i++ ) {
    if( sn[i] == "[" ) {
      nested++;

      if( nested == 5 ) {
        pair_index = i;
        break;
      }
    } else if( sn[i] == "]" ) {
      nested--;
    } 
  }

  if( pair_index ) {
    let before = sn.substring( 0, pair_index );

    let matches = sn.substring( pair_index ).match( /\[(\d+),(\d+)\](.*)/ );

    let after = matches[3];

    let lv = parseInt( matches[1] );
    let rv = parseInt( matches[2] );

    let before_regex = new RegExp( "^(\\S+?)(\\d+)(\\D+)$" );

    matches = before.match( before_regex );

    if( matches ) {
      before = before.replace( before_regex, `${matches[1]}${lv + parseInt( matches[2] )}${matches[3]}` )
    }

    let after_regex = new RegExp( "^(\\D+?)(\\d+)" );

    matches = after.match( after_regex );

    if( matches ) {
      after = after.replace( after_regex, `${matches[1]}${rv + parseInt( matches[2] )}` )
    }

    exploded_sn = sn.replace( /^.*$/, before + 0 + after );
  }

  return( exploded_sn );
}


function splitString( sn ) {
  let split_sn = null;

  let matches = sn.match( /(\d{2,})/ );

  if( matches ) {
    let split_number = parseInt( matches[1] );

    let new_pair = `[${Math.floor( split_number / 2)},${Math.ceil( split_number / 2)}]`;

    split_sn = sn.replace( /(\d{2,})/, new_pair );
  }

  return( split_sn );
}


function getMagnitudeString( sn ) {
  return( getMagnitudeArray(  JSON.parse( sn ) ) );
}

/************************************************************************************
 * 
 * Test Functions
 * 
 ************************************************************************************/

let TEST_MAGNITUDES = [
  [9,1],
  [[9,1],[1,9]],
  [[1,2],[[3,4],5]],
  [[[[0,7],4],[[7,8],[6,0]]],[8,1]],
  [[[[1,1],[2,2]],[3,3]],[4,4]],
  [[[[3,0],[5,3]],[4,4]],[5,5]],
  [[[[5,0],[7,4]],[5,5]],[6,6]],
  [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]
]

function testMagnitude() {
  for( let test of TEST_MAGNITUDES ) {
    log( getMagnitude( USE_STRINGS ? JSON.stringify( test ) : test ) );
  }
}


let TEST_SPLIT = [[[[0,7],4],[15,[0,13]]],[1,1]];

function testSplit() {
  let sn = USE_STRINGS ? JSON.stringify( TEST_SPLIT ) : _.cloneDeep( TEST_SPLIT );

  split( sn );

  log( JSON.stringify( sn ) );
  
  split( sn );

  log( JSON.stringify( sn ) );
}


let TEST_EXPLODES = [
  [[[[[9,8],1],2],3],4],
  [7,[6,[5,[4,[3,2]]]]],
  [[6,[5,[4,[3,2]]]],1],
  [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]],
  [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]],
]

function testExplode() {
  for( let test of TEST_EXPLODES ) {
    let sn = USE_STRINGS ? JSON.stringify( test ) : _.cloneDeep( TEST_SPLIT );

    sn = explode( sn );

    log( JSON.stringify( sn ) );
  }
}



/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, sns ) {
  let answer = 0;

  // testMagnitude();

  // testSplit();

  testExplode()

  let sn = null;

  for( let num of sns ) {
    if( !sn ) {
      sn = num;
    } else {
      sn = add( sn, num );
    }
  }

  log( `sn: ${JSON.stringify( sn )}` );

  answer = getMagnitude( sn );

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, sns ) {
  let answer = 0;

  let max_magnitude = -Infinity;

  for( let x of sns ) {
    for( let y of sns ) {
      let magnitude = getMagnitude( add( x, y ) );

      if( magnitude > max_magnitude ) {
        max_magnitude = magnitude;
      }
    }
  }

  answer = max_magnitude;

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
