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
  "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X",
  "mem[8] = 11",
  "mem[7] = 101",
  "mem[8] = 0"
]


const INPUT_TEST2 = [
  "mask = 000000000000000000000000000000X1001X",
  "mem[42] = 100",
  "mask = 00000000000000000000000000000000X0XX",
  "mem[26] = 1",
]


const INPUT_REAL = fs.readFileSync( './src/2020/data/day14.data' ).toString().split( "\n" );


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

 // Note:  Javascript bitwise operators work on 32 bit values, and our memory is 36 bit so have to use BigInt values instead!

function getFloatMasks( value ) {
  let floats = [];

  return( floats );
}

function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {
    let entry = null;

    let matches = line.match( /^(\S*) = (\S*)$/ );

    if( matches[1] == "mask" ) { 
      let value  = matches[2];
      let and    = value.replace( /X/g, "1" );
      let or     = value.replace( /X/g, "0" );

      entry = { op: "mask", and: BigInt( "0b" + and ), or: BigInt( "0b" + or ), float: value };
    } else {
      let addr = matches[1].match( /^mem\[(\d*)\]$/ );

      entry = { op: "mem", addr: BigInt( addr[1] ), value: BigInt( matches[2] ) };
    }

    parsed.push( entry );
  }
  
  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function runProgramPart1( program, memory ) {
  let mask_and = null;
  let mask_or  = null;

  for( let instruction of program ) {
    if( instruction.op == "mask" ) {
      mask_and = instruction.and;
      mask_or  = instruction.or;

      // console.log( `set mask and ${instruction.and}, or: ${instruction.or}`)
    } else {
      let set = instruction.value;

      set &= mask_and;
      set |= mask_or;

      // console.log( `and ${mask_and}, or: ${mask_or}`)
      // console.log( `set ${instruction.addr} ==> ${set}`)
      
      memory[ instruction.addr ] = set;
    }
  }
}


function getFloatPermutations( float, float_count ) {
  let permutations = [];

  if( float_count == 1 ) {
    permutations.push( float.replace( "X", "0" ) );
    permutations.push( float.replace( "X", "1" ) );
  } else {
    permutations.push( ...getFloatPermutations( float.replace( "X", "0" ), float_count - 1 ) );
    permutations.push( ...getFloatPermutations( float.replace( "X", "1" ), float_count - 1 ) );
  }

  return( permutations );
}


function getFloats( mask_float ) {
  let floats = [];

  let float = mask_float.replace( /0|1/g, "-" );

  let float_count = float.split( "X" ).length - 1;

  let permutations = getFloatPermutations( float, float_count );

  // console.log( permutations );

  for( let permutation of permutations ) {
    let entry = {
      and:  BigInt( "0b" + permutation.replace( /-/g, "1" ) ),
      or:   BigInt( "0b" + permutation.replace( /-/g, "0" ) ),
    }

    floats.push( entry );
  }

  // console.log( `${float}, X count: ${float_count}, floats: ${floats.length}` );

  // console.log( floats );

  return( floats );
}


function getAddrs( addr, mask_or, floats ) {
  let addrs = [];

  let base_addr = addr | mask_or;

  for( let float of floats ) {
    addrs.push( ( base_addr | float.or ) & float.and );
  }

  return( addrs );
}


function runProgramPart2( program, memory ) {
  let mask_or     = null;
  let floats      = null;

  for( let instruction of program ) {
    if( instruction.op == "mask" ) {
      mask_or = instruction.or;
      floats  = getFloats( instruction.float );
    } else {
      let set   = instruction.value;
      let addr  = instruction.addr;

      let addrs = getAddrs( addr, mask_or, floats );

      // console.log( addrs );

      for( let a of addrs ) {
        memory[ a ] = set;
      }
    }
  }
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let memory = {};

  runProgramPart1( input, memory );

  let sum = BigInt( 0 );

  // console.log( memory )

  for( let key of Object.keys( memory ) ) {
    sum += memory[ key ];                       
  }

  answer = sum;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let memory = {};

  runProgramPart2( input, memory );

  let sum = BigInt( 0 );

  // console.log( memory )

  for( let key of Object.keys( memory ) ) {
    sum += memory[ key ];                       
  }

  answer = sum;
  console.log( `Day ${day} answer, part 2: ${answer}` );
 }


/************************************************************************************
 * 
 * Main
 * 
 ************************************************************************************/

const PART    = process.argv[2];
const TEST    = process.argv[3];

const DAY     = 14;

let input;

if( TEST.startsWith( "t")  ) {
  input = PART == "1" ? INPUT_TEST : INPUT_TEST2;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
