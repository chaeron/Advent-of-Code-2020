"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  '0: 4 1 5',
  '1: 2 3 | 3 2',
  '2: 4 4 | 5 5',
  '3: 4 5 | 5 4',
  '4: "a"',
  '5: "b"',
  '',
  'ababbb',
  'bababa',
  'abbbab',
  'aaabbb',
  'aaaabbb',
]


const INPUT_TEST2 = [     
  '42: 9 14 | 10 1',
  '9: 14 27 | 1 26',
  '10: 23 14 | 28 1',
  '1: "a"',
  '11: 42 31 | 42 11 31',         // Already replaced with recursive rule
  '5: 1 14 | 15 1',
  '19: 14 1 | 14 14',
  '12: 24 14 | 19 1',
  '16: 15 1 | 14 14',
  '31: 14 17 | 1 13',
  '6: 14 14 | 1 14',
  '2: 1 24 | 14 4',
  '0: 8 11',
  '13: 14 3 | 1 12',
  '15: 1 | 14',
  '17: 14 2 | 1 7',
  '23: 25 1 | 22 14',
  '28: 16 1',
  '4: 1 1',
  '20: 14 14 | 1 15',
  '3: 5 14 | 16 1',
  '27: 1 6 | 14 18',
  '14: "b"',
  '21: 14 1 | 1 14',
  '25: 1 1 | 1 14',
  '22: 14 14',
  '8: 42 | 42 8',                 // Already replaced with recursive rule
  '26: 14 22 | 1 20',
  '18: 15 15',
  '7: 14 5 | 1 21',
  '24: 14 1',
  '',
  'abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa',
  'bbabbbbaabaabba',
  'babbbbaabbbbbabbbbbbaabaaabaaa',
  'aaabbbbbbaaaabaababaabababbabaaabbababababaaa',
  'bbbbbbbaaaabbbbaaabbabaaa',
  'bbbababbbbaaaaaaaabbababaaababaabab',
  'ababaaaaaabaaab',
  'ababaaaaabbbaba',
  'baabbaaaabbaaaababbaababb',
  'abbbbabbbbaaaababbbbbbaaaababb',
  'aaaaabbaabaaaaababaa',
  'aaaabbaaaabbaaa',
  'aaaabbaabbaaaaaaabbbabbbaaabbaabaaa',
  'babaaabbbaaabaababbaabababaaab',
  'aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba',
];


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

function parse_data( lines ) {
  let start     = [];
  let rules     = [];
  let messages  = [];

  let parse = "rules";
  for( let line of lines ) {

    if( parse == "rules" ) {
      if( line == "" ) {
        parse = "data";
      } else {
        if( line.includes( '"' ) ) {
          let matched = line.match( /^(\d*): "(\S)"$/ );

          let rule_id = Number( matched[1] );

          start.push( Number( matched[1] ) );

          rules.push( { id: rule_id, match: matched[2] } );
        } else {
          // Create temp[late] regex in the match attribute where rule references are wrapped in "-" delimiter so that we only replace the whole rule reference not just one digit of the reference in a later step!

          if( line.includes( "|" ) ) {
            let matched = line.match( /^(\d*):\s(.*)/ );

            let rule_id = Number( matched[1] );

            let ors = matched[2].split( " | " );

            let or1 = ors[0].split( " " ).map( v => "-" + v + "-" ).join( "" );
            let or2 = ors[1].split( " " ).map( v => "-" + v + "-" ).join( "" );

            let match = "(" + or1 + ")|(" + or2 + ")";

            // Special handling for Part 2 recursive rules

            let or2_num = ors[1].split( " " ).map( v => Number( v ) );

            if( or2_num.includes( rule_id ) ) {     // Recursive rule in Part 2?
              if( or2_num.findIndex( v => v == rule_id ) == or2_num.length - 1 ) {    // Tail recursion?
                match = "((" + or1 + ")+)";         // Tail recursive
              } else {
                let ends = ors[0].split( " " );  // Centre recursive

                let terms = []

                // Repeat matched pairs 4 times ( 4 was determined experimentally as minimum number of repettions)
                for( let i = 4; i > 0; i -- ) {
                  terms.push( "((-" + ends[0] + `-){${i}}(-` + ends[1] + `-){${i}})` );
                }

                match = "(" + terms.join( "|" ) + ")";
              }
            } 

            rules.push( { id: Number( matched[1] ), match: match } );

          } else {
            let matched = line.match( /^(\d*):\s(.*)/ );

            let rule_id = Number( matched[1] );

            let or = matched[2].split( " " ).map( v => "-" + v + "-" ).join( "" );

            let match = "(" + or + ")";

            rules.push( { id: rule_id, match: match } );
          }
        }
      }
    } else {
      messages.push( line );
    }
  }

  rules.sort( ( a, b ) => a.id - b.id );
  
  // console.log( start );
  // console.log( JSON.stringify( rules, null, 2 ) );
  // console.log( messages );
  // console.log( Math.max( ...messages.map( m => m.length ) ) );

  return( [ rules, start, messages ] );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function expandRules( rules, replace, replaced ) {
  let replace_values = []
  
  for( let e of replace ) {
    replace_values.push( rules.find( r => r.id == e ).match );
  }
    
  let next_replace = [];

  for( let rule of rules ) {
    if( !replace.includes( rule.id ) && !replaced.includes( rule.id ) ) {   // Only do a replace if we haven't already done it for an expanded rule and the rule is fully expanded already
      for( let i = 0; i < replace.length; i++ ) {
        rule.match = rule.match.replace( new RegExp( "-" + replace[i] + "-", "g" ), "(" + replace_values[i] + ")" );    // Replace rule id references with the rule match value here
      }

      if( !rule.match.match( /-/ ) ) {    // Is this rule now fully expanded?
        next_replace.push( rule.id );
        replaced.push( rule.id );
      }
    }
  }

  if( next_replace.length ) {
    expandRules( rules, next_replace, replaced );
  }
}


function getRegex( rule ) {
  // Optimize the rule regex by eliminating parenthesis groups where possible

  let rule0_match = rule.match;

  while( rule0_match.match( /\(([ab]+)\)/ ) ) {
    rule0_match = rule0_match.replace( /\(([ab]+)\)/g, "$1" );
  }

  // Create the final regex

  let regex = new RegExp( "^" + rule0_match + "$" );

  return( regex );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let [ rules, start, messages ] = input;

  expandRules( rules, start, [ ...start ] );

  // console.log( JSON.stringify( rules[0], null, 2 ) );

  let regex = getRegex( rules[0] );

  // console.log( regex );

  let match_count = 0;

  for( let msg of messages ) {
    if( msg.match( regex ) ) {
      match_count++;
    }
  }

  answer = match_count;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let [ rules, start, messages ] = input;

  expandRules( rules, start, [ ...start ] );

  // console.log( JSON.stringify( rules, null, 2 ) );

  let regex = getRegex( rules[0] );

  // console.log( regex );

  let match_count = 0;

  for( let msg of messages ) {
    if( msg.match( regex ) ) {
      match_count++;
    }
  }

  answer = match_count;

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

  if( PART == "2" ) {
    // Change two rules to be recursive per instructions

    let changed_input = [];

    for( let line of input ) {
      if( line.startsWith( "8:" ) ) {
        changed_input.push( "8: 42 | 42 8" );
      } else if( line.startsWith( "11:" ) ) {
        changed_input.push( "11: 42 31 | 42 11 31" );
      } else {
        changed_input.push( line );
      }
    }

    input = changed_input;
  }
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
