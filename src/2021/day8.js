"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe",
  "edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc",
  "fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg",
  "fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb",
  "aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea",
  "fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb",
  "dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe",
  "bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef",
  "egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb",
  "gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


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

    let values = line.split( ' ' );

    let entry = {
      segments: values.slice( 0, 10 ),
      display:  values.slice( 11 )
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

function my_func( program, loc, accumulator ) {
  

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, input ) {
  let answer = 0;

 let lengths = [ 2, 4, 3, 7 ];

 for( let entry of input ) {
   for( let output of entry.display ) {
     if( lengths.includes( output.length ) ) {
       answer++;
     }
   }
 }

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  for( let entry of input ) {
    let digit_patterns = {};

    let length_5 = [];      // Digit 2, 3 or 5
    let length_6 = [];      // Digit 0, 6 or 9
    
    // Find known digit patterns and group other digits

    for( let segments of entry.segments ) {
      switch( segments.length ) {
        case 2:
          digit_patterns[1] = segments;
          break;

        case 3:
          digit_patterns[7] = segments;
          break;

        case 4:
          digit_patterns[4] = segments;
          break;

        case 7:
          digit_patterns[8] = segments;
          break;

        case 5:
          length_5.push( segments );
          break;
      
        case 6:
          length_6.push( segments );
          break;
      }
    }

    // Determine digit 3

    let digit_1 = digit_patterns[1].split('');

    for( let segments of length_5 ) {
      let common = _.intersection( segments.split(''), digit_1 );

      if( common.length == 2 ) {
        digit_patterns[3] = segments;
        _.pull( length_5, segments );
      }
    }

    // Determine digit 6

    for( let segments of length_6 ) {
      let common = _.intersection( segments.split(''), digit_1 );

      if( common.length != 2 ) {
        digit_patterns[6] = segments;
        _.pull( length_6, segments );
      }
    }

    // Determine digits 0 & 9

    let dg = _.difference( digit_patterns[3].split(''), digit_patterns[7].split('') );  // dg are the difference between 3 and 7

    if( _.intersection( length_6[0].split(''), dg ).length == 2 ) {     // 9 has dg, 0 doesn't
      digit_patterns[9] = length_6[0];
      digit_patterns[0] = length_6[1];
    } else {
      digit_patterns[0] = length_6[0];
      digit_patterns[9] = length_6[1];
    }

    // Determine digits 2 & 5

    let e = _.xor( digit_patterns[8].split(''), digit_patterns[9].split('') );  // e is the difference between 8 & 9

    if( _.intersection( length_5[0].split(''), e ).length == 1 ) {     // 2 has e, 5 doesn't
      digit_patterns[2] = length_5[0];
      digit_patterns[5] = length_5[1];
    } else {
      digit_patterns[5] = length_5[0];
      digit_patterns[2] = length_5[1];
    }

    log( digit_patterns );

    // Determine output

    let display = "";

    log( entry.display )

    for( let output of entry.display ) {
      for( let digit of Object.keys( digit_patterns ) ) {
        if( _.xor( output.split(''), digit_patterns[digit].split('') ).length == 0 ) {
          display += digit;
          break;
        }
      }
    }

    log( display );

    answer += parseInt( display );
    
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
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
