"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "class: 1-3 or 5-7",
  "row: 6-11 or 33-44",
  "seat: 13-40 or 45-50",
  "",
  "your ticket:",
  "7,1,14",
  "",
  "nearby tickets:",
  "7,3,47",
  "40,4,50",
  "55,2,20",
  "38,6,12"
];

const INPUT_TEST2 = [
  "class: 0-1 or 4-19",
  "row: 0-5 or 8-19",
  "seat: 0-13 or 16-19",
  "",
  "your ticket:",
  "11,12,13",
  "",
  "nearby tickets:",
  "3,9,18",
  "15,1,5",
  "5,14,9"
];


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  let fields          = [];
  let your_ticket     = [];
  let nearby_tickets  = [];

  let parse = "fields";

  for( let line of lines ) {
    if( parse == "fields" ) {
      if( line == "" ) {
        parse = "your";
      } else {
        let matches = line.match( /^(.*): (\d*)-(\d*) or (\d*)-(\d*)$/ );

        let field = {
          field_name: matches[1],
          validations: [
            { from: Number( matches[2] ), to: Number( matches[3] ) },
            { from: Number( matches[4] ), to: Number( matches[5] ) }
          ]
        }

        fields.push( field );
      }

    } else if( parse == "your" ) {
      if( line == "" ) {
        parse = "nearby";
      } else {
        if( line != "your ticket:" ) {
          your_ticket = line.split( "," ).map( v => Number( v ) );
        }
      }
    } else {
      if( line != "nearby tickets:" ) {
        let ticket = line.split( "," ).map( v => Number( v ) );

        nearby_tickets.push( ticket );
      }
    }
  }
  
  // console.log( JSON.stringify( fields, null, 2 ) );
  // console.log( your_ticket );
  // console.log( nearby_tickets );

  return( [ fields, your_ticket, nearby_tickets ] );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function validateValue( value, fields ) {
  for( let field of fields ) {
    for( let validation of field.validations ) {
      if( value >= validation.from && value <= validation.to ) {
        return( 0 );
      }
    }
  }

  return( value );
}


function getTicketInvalidFieldTotal( ticket, fields ) {
  let invalid_total = 0;

  for( let value of ticket ) {
    invalid_total += validateValue( value, fields );
  }
  
  return( invalid_total );
}


function getPossibleFieldOrder( tickets, fields ) {
  let ordered_fields = [];

  for( let field of fields ) {
    let ticket_index;

    let possible_indexes = [];

    for( ticket_index = 0; ticket_index < tickets[0].length; ticket_index++ ) {
      let valid_ticket_index = true;

      for( let ticket of tickets ) {
        let value = ticket[ ticket_index ];

        let valid_value = false;

        for( let validation of field.validations ) {
          if( value >= validation.from && value <= validation.to ) {
            valid_value = true;
            break;
          }
        }

        if( !valid_value ) {
          valid_ticket_index = false;
        }

        // console.log( `field: ${field.field_name}, checked ticket: ${ticket}, index:  ${ticket_index}, value: ${value}, validations: ${JSON.stringify( field.validations )}, valid: ${valid_ticket_index}` );

        if( !valid_ticket_index ) {
          break;
        }
      }

      if( valid_ticket_index ) {
        possible_indexes.push( ticket_index );
      }
    }

    ordered_fields.push( [ field.field_name, possible_indexes ] );
  }


  return( ordered_fields );
}


function getFieldOrder( possibles ) {
  let determined_count = 0;
  let ordered_fields = [];

  while( determined_count < possibles.length - 1 ) {              // Value at index 15 doesn't appear in list, but is not required for solution, so can ony iterate possibles.length - 1 times here!
    let single_value = possibles.find( p => p[1].length == 1 );

    ordered_fields.push( [ single_value[0], single_value[1][0] ] );

    // console.log( ordered_fields );

    let remove_index = single_value[1][0];

    for( let possible of possibles ) {
      const index = possible[1].indexOf( remove_index );
      if( index > -1 )  {
        possible[1].splice( index, 1 );
      }
    }

    determined_count++;
  }

  return( ordered_fields );
}

/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let [ fields, your_ticket, nearby_tickets ] = input;

  let invalid_total = 0;

  for( let ticket of nearby_tickets ) {
    invalid_total += getTicketInvalidFieldTotal( ticket, fields );
  }

  answer = invalid_total;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let [ fields, your_ticket, nearby_tickets ] = input;

  let valid_nearby = [];

  for( let ticket of nearby_tickets ) {
    if( getTicketInvalidFieldTotal( ticket, fields ) === 0 ) {
      valid_nearby.push( ticket );
    }
  }

  valid_nearby.push( your_ticket );

  // console.log( valid_nearby );
  // console.log( valid_nearby.length );

  let possible_field_order = getPossibleFieldOrder( valid_nearby, fields );

  // console.log( possible_field_order );

  let field_order = getFieldOrder( possible_field_order );

  // console.log( field_order );

  let multiply = 1;

  for( let field of field_order ) {
    if( field[0].startsWith( "departure" ) ) {
      multiply *= your_ticket[ field[1] ];
    }
  }

  answer = multiply;

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
  input = PART == "1" ? INPUT_TEST : INPUT_TEST2;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
