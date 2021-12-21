"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "NNCB",
  "",
  "CH -> B",
  "HH -> N",
  "CB -> H",
  "NH -> C",
  "HB -> C",
  "HC -> B",
  "HN -> C",
  "NN -> C",
  "BH -> H",
  "NC -> B",
  "NB -> B",
  "BN -> B",
  "BB -> N",
  "BC -> B",
  "CC -> N",
  "CN -> C"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/


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
  let rules   = [];
  let polymer = null;

  for( let line of lines ) {

    if( line.length ) {
      if( !polymer ) {
        polymer = line;
      } else {
        let rule_parts = line.split( " -> " );

        rules[ rule_parts[0 ]] = rule_parts[1];
      } 
    }
  }
  
  log( polymer );
  log( rules );

  return( [ polymer, rules ] );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

 function addIncrementToCount( item, increment, counts ) {
  if( counts[ item ] ) {
    counts[ item ] += increment;
  } else {
    counts[ item ] = increment;
  }
}
 

function processInsertions( first, second, rules, counts, iteration, max_iterations ) {
  let inserted_element = rules[ first + second ];

  addIncrementToCount( inserted_element, 1, counts );

  if( iteration < max_iterations ) {
    processInsertions( first, inserted_element, rules, counts, iteration + 1, max_iterations );
    processInsertions( inserted_element, second, rules, counts, iteration + 1, max_iterations );
  }
}


function getRevisedPairCounts( pair_counts, rules ) {
  let revised_counts = {};

  for( let [ pair, count ] of Object.entries( pair_counts ) ) {
    let inserted = rules[ pair ];

    addIncrementToCount( pair[0] + inserted, count, revised_counts );
    addIncrementToCount( inserted + pair[1], count, revised_counts );
  }

  return( revised_counts );
}


function getMinMaxDifference( counts ) {
  let min = Infinity;
  let max = -Infinity;

  for( let element of Object.keys( counts ) ) {
    if( counts[element] < min ) {
      min = counts[element];
    }

    if( counts[element] > max ) {
      max = counts[element];
    }
  }

  return( max - min );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, polymer, rules ) {
  let answer = 0;

  // Brute force, recursive descent solution

  let counts = {};

  for( let i = 0; i < polymer.length; i++ ) {
    addIncrementToCount( polymer[i], 1, counts );
  }

  for( let i = 0; i <= polymer.length - 1; i++ ) {
    processInsertions( polymer[i], polymer[i+1], rules, counts, 1, 10 );
  }

  answer = getMinMaxDifference( counts );

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, polymer, rules ) {
  let answer = 0;

  // Recursive solution won't work since it's exponential

  // Track counts of pairs for each iteration instead since there is a reasonably small number of pairs

  // Get initial pair counts

  let pair_counts = {};

  for( let i = 0; i < polymer.length - 1; i++ ) {
    addIncrementToCount( polymer[i] + polymer[i+1], 1, pair_counts );
  }

  // get revised pair counts for each iteration

  for( let i = 1; i <= 40; i++ ) {
    pair_counts = getRevisedPairCounts( pair_counts, rules );

    log( pair_counts );
  }

  // Individual letter counts are the sum of counts for each pair that starts with that letter

  let counts = {};

  for( let [ pair, count ] of Object.entries( pair_counts ) ) {
    addIncrementToCount( pair[0], count, counts );
  }

  // Last letter in polymer is not included in first letter pair counts so increment it by 1

  addIncrementToCount( polymer[ polymer.length -1 ], 1, counts );

  log( counts );

  answer = getMinMaxDifference( counts );
  
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
