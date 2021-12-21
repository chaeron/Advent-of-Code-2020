"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "light red bags contain 1 bright white bag, 2 muted yellow bags.",
  "dark orange bags contain 3 bright white bags, 4 muted yellow bags.",
  "bright white bags contain 1 shiny gold bag.",
  "muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.",
  "shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.",
  "dark olive bags contain 3 faded blue bags, 4 dotted black bags.",
  "vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.",
  "faded blue bags contain no other bags.",
  "dotted black bags contain no other bags.",
]

const INPUT_TEST2 = [
"shiny gold bags contain 2 dark red bags.",
"dark red bags contain 2 dark orange bags.",
"dark orange bags contain 2 dark yellow bags.",
"dark yellow bags contain 2 dark green bags.",
"dark green bags contain 2 dark blue bags.",
"dark blue bags contain 2 dark violet bags.",
"dark violet bags contain no other bags.",
]

const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = {};

  for( let line of lines ) {
    let [ bag, contains_str ] =  line.split( " bags contain " );

    // console.log( `bag: ${bag}, contains: ${contains_str}` );

    let contains = [];

    if( !contains_str.startsWith( "no other " ) ) {
      let contained_bags = contains_str.split( ", " );

      // console.log( contained_bags )

      for( let contained_bag of contained_bags ) {
        let [ ignore, count, bag ] = contained_bag.match( /^(\d*)\s(.*)\sbag/ );

        // console.log( `contained bag: ${bag}, count: ${count}` );

        contains.push( [ bag, Number( count ) ] );
      }
    }

    parsed[ bag ] = contains;
  }
  
  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function bagContains( input, inner_bags, find_bag ) {
  if( inner_bags.find( inner_bag => inner_bag[0] == find_bag ) ) {
    return( true );
  }

  for( let inner_bag of inner_bags ) {
    if( bagContains( input, input[ inner_bag[0] ], find_bag ) ) {
      return( true )
    }
  }

  return( false );
}


function getNumberOfContainedBags( input, outer_bag, outer_count ) {
  let contained_count = 0;

  // console.log( `counting contains for ${outer_bag}` );

  let contained_bags = input[ outer_bag ];

  // console.log( `   containded: ${contained_bags }` )

  for( let contained_bag of contained_bags ) {
    contained_count += outer_count * contained_bag[ 1 ];

    contained_count += outer_count * getNumberOfContainedBags( input, contained_bag[ 0 ], contained_bag[1] );
  }

  return( contained_count );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, input ) {
  let sum = 0;

  let find_bag = "shiny gold";

  for( let outer_bag of Object.keys( input ) ) {
    if(  bagContains( input, input[ outer_bag ], find_bag ) ) {
      sum++;
    }
  }

  console.log( `Day ${day} answer, part 1: ${sum}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let sum = 0;

  let outer_bag = "shiny gold";

  sum = getNumberOfContainedBags( input, outer_bag, 1 );

  console.log( `Day ${day} answer, part 2: ${sum}` );
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

