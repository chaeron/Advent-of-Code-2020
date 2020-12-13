"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd",
  "byr:1937 iyr:2017 cid:147 hgt:183cm",
  "",
  "iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884",
  "hcl:#cfa07d byr:1929",
  "",
  "hcl:#ae17e1 iyr:2013",
  "eyr:2024",
  "ecl:brn pid:760753108 byr:1931",
  "hgt:179cm",
  "",
  "hcl:#cfa07d eyr:2025 pid:166559648",
  "iyr:2011 ecl:brn hgt:59in",
  "",
]


const INPUT_REAL = fs.readFileSync( './src/2020/data/day4.data' ).toString().split( "\n" );


/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let parsed = [];

  let entry = {};

  for( let line of lines ) {
    if( line ) {
      let fields = line.split( " " );

      for( let field of fields ) {
        let matches = field.match( /^([a-z]+):(\S+)(\s|$)/ );

        entry[ matches[1] ] = matches[2];
      }
    } else {
      if( entry ) {
        parsed.push( entry );
      }

      entry = {};
    }
  }

  // console.log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
//     If cm, the number must be at least 150 and at most 193.
//     If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

function areFieldsValid( row, keys ) {
  let valid = true;

  for( let key of keys ) {
    let value = row[ key ];

    switch( key ) {
      case "byr":
        if( value.match( /^\d{4}$/ ) ) {
          if( Number( value ) < 1920 || Number( value ) > 2002 ) {
            valid = false;
          }
        } else {
          valid = false;
        }
        break;

      case "iyr":
        if( value.match( /^\d{4}$/ ) ) {
          if( Number( value ) < 2010 || Number( value ) > 2020 ) {
            valid = false;
          }
        } else {
          valid = false;
        }
        break;

      case "eyr":
        if( value.match( /^\d{4}$/ ) ) {
          if( Number( value ) < 2020 || Number( value ) > 2030 ) {
            valid = false;
          }
        } else {
          valid = false;
        }
        break;

      case "hgt":
        let matches = value.match( /^(\d+)(cm|in)$/ );

        if( matches ) {
          if( matches[2] == "cm") {
            if( Number( matches[1] ) < 150 || Number( matches[1] ) > 193 ) {
              valid = false;
            }
          } else {
            if( Number( matches[1] ) < 59 || Number( matches[1] ) > 76 ) {
              valid = false;
            }
          }
        } else {
          valid = false;
        }
        break;

      case "hcl":
        if( !value.match( /^#[0-9a-f]{6}$/ ) ) {
          valid = false;
        }
        break;

      case "ecl":
        if( ![ "amb", "blu", "brn", "gry", "grn", "hzl", "oth" ].includes( value ) ) {
          valid = false;
        }
        break;

      case "pid":
        if( !value.match( /^\d{9}$/ ) ) {
          valid = false;
        }
        break;

      case "cid":
        break;
    }

    if( !valid ) {
      break;
    }
  }

  return( valid )
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let valid_count = 0;

  for( let row of input ) {
    let keys = Object.keys( row );
  
    let field_count = keys.length - ( keys.includes( "cid" ) ? 1 : 0 );
  
    if( field_count == 7 ) {
        valid_count++;
    }
  }

  answer = valid_count;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let valid_count = 0;
  
  for( let row of input ) {
    let keys = Object.keys( row );
  
    let field_count = keys.length - ( keys.includes( "cid" ) ? 1 : 0 );
  
    if( field_count == 7 && areFieldsValid( row, keys ) ) {
      valid_count++;
    }
  }

  answer = valid_count;

  console.log( `Day ${day} answer, part 2: ${answer}` );
 }


/************************************************************************************
 * 
 * Main
 * 
 ************************************************************************************/

const PART    = process.argv[2];
const TEST    = process.argv[3];

const DAY     = 4;

let input;

if( TEST.startsWith( "t")  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
