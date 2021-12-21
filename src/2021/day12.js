"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );
const { format } = require('path');

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "start-A",
  "start-b",
  "A-c",
  "A-b",
  "b-d",
  "A-end",
  "b-end"
]

const INPUT_TEST2 = [
  "dc-end",
  "HN-start",
  "start-kj",
  "dc-start",
  "dc-HN",
  "LN-dc",
  "HN-end",
  "kj-sa",
  "kj-HN",
  "kj-dc"
]

const INPUT_TEST3 = [
  "fs-end",
  "he-DX",
  "fs-he",
  "start-DX",
  "pj-DX",
  "end-zg",
  "zg-sl",
  "zg-pj",
  "pj-he",
  "RW-he",
  "fs-DX",
  "pj-RW",
  "zg-RW",
  "start-pj",
  "he-WI",
  "zg-he",
  "pj-fs",
  "start-RW"
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
  let caves = {};

  for( let line of lines ) {

    let from_to = line.split( "-" );

    let from = from_to[0];
    let to   = from_to[1];

    let from_entry = caves[from];
    let to_entry   = caves[to];

    if( !from_entry ) {
      from_entry = {
        name:    from,
        once:    from == from.toLowerCase(),
        links:   new Set()
      }

      caves[from] = from_entry;
    }

    if( !to_entry ) {
      to_entry = {
        name:    to,
        once:    to == to.toLowerCase(),
        links:   new Set()
      }

      caves[to]   = to_entry;
    }

    from_entry.links.add( to_entry );
    to_entry.links.add( from_entry );
  }

  // convert the Sets to arrays at this point

  for( let entry of Object.values( caves ) ) {
    entry.links = [ ...entry.links ];
  }
  
  if( LOG ) {
    for( let [ key, value ] of Object.entries( caves ) ) {
      log( `cave: ${key}, once: ${value.once}, links: ${value.links.map( l => l.name )}` );
    }
  }

  return( caves );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function countPaths( from, visited ) {
  let path_count = 0;

  if( from.name == "end") {
    path_count = 1;
  } else {
    let tos = from.links.filter( to => !to.once || !visited.includes( to.name ) );

    for( let to of tos ) {
      path_count += countPaths( to, [ from.name, ...visited ] );
    }
  }

  return( path_count );
}


function countPathsAllowOneDoubleVisit( from, visited, double_visit ) {
  let path_count = 0;

  if( from.name == "end") {
    path_count = 1;
  } else {
    let tos = from.links.filter( to => !to.once || ( to.name != "start" && ( !double_visit || !visited.includes( to.name ) ) ) );

    for( let to of tos ) {
      path_count += countPathsAllowOneDoubleVisit( to, [ from.name, ...visited ], double_visit || ( to.once && visited.includes( to.name ) ) );
    }
  }

  return( path_count );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, caves ) {
  let answer = 0;

  answer = countPaths( caves.start, [ "start" ] );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, caves ) {
  let answer = 0;

  answer = countPathsAllowOneDoubleVisit( caves.start, [ "start" ], false );
  
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
