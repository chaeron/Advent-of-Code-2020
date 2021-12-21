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
  "D2FE28",
  "38006F45291200",
  "EE00D40C823060",
  "8A004A801A8002F478",
  "620080001611562C8802118E34",
  "C0015000016115A2E0802F182340",
  "A0016C880162017C3686B18A3D4780",
]

const INPUT_TEST2 = [
  "C200B40A82",
  "04005AC33890",
  "880086C3E88112",
  "CE00C43D881120",
  "D8005AC2A8F0",
  "F600BC2D8F",
  "9C005AC2F8F0",
  "9C0141080250320F1802104A08"
]

const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

const LITERAL = 4;

const SUM     = 0;
const PRODUCT = 1;
const MIN     = 2;
const MAX     = 3;
const GT      = 5;
const LT      = 6;
const EQ      = 7;


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

    let entry = "";

    for( let chr of line ) {
      entry += parseInt( chr, 16 ).toString( 2 ).padStart( 4, "0" );
    }

    parsed.push( entry );
  }
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function parseTransmission( transmission, start ) {
  let pos = start;

  let packet = {
    version:   null,
    type:      null,
  }

  packet.version = parseInt( transmission.substring( pos, pos + 3 ), 2 );
  packet.type    = parseInt( transmission.substring( pos + 3, pos + 6 ), 2 );

  pos += 6;

  if( packet.type == LITERAL ) {      // Literal    
    packet.value = "";

    let done = false;

    while( !done ) {
      let segment = transmission.substring( pos, pos + 5 );

      pos += 5;

      packet.value += segment.substring( 1 );

      if( segment[0] == "0" ) {
        packet.value = parseInt( packet.value, 2 );

        done = true;
      }
    }
  } else {                      // Operation
    packet.len_type = transmission[ pos ];

    pos++;

    let len_bits = packet.len_type == "0" ? 15 : 11;

    packet.len = parseInt( transmission.substring( pos, pos + len_bits ), 2 );

    pos += len_bits;

    packet.subpackets = [];

    let done = false;

    let processed_len = 0;

    while( !done ) {
      let [ subpacket, new_pos ] = parseTransmission( transmission, pos );

      processed_len += new_pos - pos;

      pos = new_pos;

      packet.subpackets.push( subpacket );

      if( packet.len_type == "0" ) {
        done = processed_len >= packet.len;
      } else {
        done = packet.subpackets.length >= packet.len;
      }
    }
  }

  return( [ packet, pos ] );
}


function sumVersions( packet ) {
  let sum = packet.version;

  if( packet.subpackets ) {
    for( let subpacket of packet.subpackets ) {
      
      sum += sumVersions( subpacket );
    }
  }

  return( sum );
}


function evaluate( packet ) {
  let value = null;

  if( packet.type == LITERAL ) {
    value = packet.value;
  } else {
    let values = packet.subpackets.map( p => evaluate( p )  );

    switch( packet.type ) {
      case SUM:
        value = values.reduce( (sum, val ) => sum + val, 0 );
        break;

      case PRODUCT:
        value = values.reduce( (prod, val ) => prod * val, 1 );
        break;

      case MIN:
        value = Math.min( ...values );
        break;

      case MAX:
        value = Math.max( ...values );
        break;

      case GT:
        value = values[0] > values[1] ? 1 : 0;
        break;

      case LT:
        value = values[0] < values[1] ? 1 : 0;
        break;

      case EQ:
        value = values[0] == values[1] ? 1 : 0;
        break;

      default:
        console.log( `ERROR - Invalid packet type: ${packet.type}` );
        break;
    }
  }

  return( value );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, transmissions ) {
  let answer = 0;

  for( let transmission of transmissions ) {
    let [ packet, pos ] = parseTransmission( transmission, 0 );

    log( packet );

    answer = sumVersions( packet );

    log( answer );
  }

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, transmissions ) {
  let answer = 0;

  for( let transmission of transmissions ) {
    let [ packet, pos ] = parseTransmission( transmission, 0 );

    log( packet );

    answer = evaluate( packet );

    log( answer );
  }

  
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
  input = PART == "1" ? INPUT_TEST : INPUT_TEST2;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
