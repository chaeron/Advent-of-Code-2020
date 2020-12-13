"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

const INPUT_TEST = [
  "abc",
  "",
  "a",
  "b",
  "c",
  "",
  "ab",
  "ac",
  "",
  "a",
  "a",
  "a",
  "a",
  "",
  "b",
  ""
]

const INPUT_RAW = fs.readFileSync( './src/2020/data/day6.data' ).toString().split( "\n" );

function parse_data( lines ) {
  let parsed = [];

  let group = [];

  for( let line of lines ) {
    if( line ) {
      group.push( line.split( "" ) );
    } else {
      if( group ) {
        parsed.push( group );
      }

      group = [];
    }
  }

  return( parsed );
}

const INPUT = parse_data( INPUT_RAW );


let part = 2;

if( part == 1 ) {
  let sum = 0;

  for( let group of INPUT ) {
    let answers = [].concat( ...group );

    let deduped = _.uniq( answers );

    sum += deduped.length;
  }

  console.log( `Day 6 answer, part ${part}: ${sum}` );
} else {
  let sum = 0;

  for( let group of INPUT ) {
    let common = _.intersection( ...group );

    sum += common.length;
  }

  console.log( `Day 6 answer, part ${part}: ${sum}` );
}