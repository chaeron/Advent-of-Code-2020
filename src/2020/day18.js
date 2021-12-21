"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "1 + 2 * 3 + 4 * 5 + 6",
  "1 + (2 * 3) + (4 * (5 + 6))",
  "2 * 3 + (4 * 5)",
  "5 + (8 * 3 + 9 + 3 * 4 * 3)",
  "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))",
  "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );



/************************************************************************************
 * 
 * Parse Data Function
 * 
 ************************************************************************************/

 function parseExpression( tokens ) {
   let expression = [];

   let idx = 0;

   while( idx < tokens.length ) {
    if( tokens[idx] == "(" ) {
      let open_parens = 1;

      for( let i = idx + 1; i < tokens.length; i++ ) {
        switch( tokens[i] ) {
          case "(":
            open_parens++;
            break;

          case ")":
            open_parens--;
            break;
        }

        if( !open_parens ) {
          let sub_tokens = tokens.slice( idx + 1, i );

          expression.push( parseExpression( sub_tokens ) );

          idx = i + 1;

          if( idx < tokens.length ) {
            expression.push( tokens[idx] );
            idx++;
          }

          break;
        } 
      }
    } else {
      expression.push( tokens[idx] );

      if( idx < tokens.length - 1 ) {
        expression.push( tokens[idx + 1] );
      }

      idx += 2;
    }
  }

   return( expression )
 }


function parse_data( lines ) {
  let parsed = [];

  for( let line of lines ) {
    let tokens = [];
    let pieces = line.split( " " );

    for( let piece of pieces ) {
      tokens.push( ...piece.split( "" ).map( t => isNaN( t ) ? t : Number( t ) ) );
    }

    // console.log( tokens )

    let entry = parseExpression( tokens, false );

    parsed.push( entry );
  }
  
  // console.log( JSON.stringify( parsed, null, 2 ) );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function evaluateExpressionNoPrecedence( expression ) {
  let value;

  if( isNaN( expression[0] ) ) {
    value = evaluateExpression( expression[0] );
  } else {
    value = expression[0];
  }

  for( let i = 1; i < expression.length; i += 2 ) {
    let second;

    if( isNaN( expression[i+1] ) ) {
      second = evaluateExpression( expression[i+1] );
    } else {
      second = expression[i+1];
    }

    switch( expression[i] ) {
      case "+":
        value += second;
        break;

      case "*":
        value *= second;
        break; 
    }
  }

  return( value );
}


function evaluateAdditions( expression ) {
  let add_idx = expression.findIndex( v => v == "+" );

  if( add_idx < 0  ) {
    return( expression );
  }

  let replace = expression[ add_idx - 1 ] + expression[ add_idx + 1 ];

  let added = evaluateAdditions( [ ...expression.slice( 0, add_idx - 1 ), replace, ...expression.slice( add_idx + 2, expression.length ) ] );

  return( added );
}


function evaluateExpressionPrecedence( expression ) {
  let resolved = [];

  // Resolve all sub-expressions first

  for( let i = 0; i < expression.length; i++ ) {
    switch( expression[i] ) {
      case "*":
      case "+":
        resolved.push( expression[i] );
        break;

      default:
        if( isNaN( expression[i] ) ) {
          resolved.push( evaluateExpressionPrecedence( expression[i] ) );
        } else {
          resolved.push( expression[i] );
        }
        break;
    }
  }

  resolved = evaluateAdditions( resolved );

  let value = evaluateExpressionNoPrecedence( resolved );

  return( value );
}



/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let sum = 0;

  for( let expression of input ) {
    let value = evaluateExpressionNoPrecedence( expression );

    sum += value;
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

  let sum = 0;

  for( let expression of input ) {
    let value = evaluateExpressionPrecedence( expression );

    sum += value;
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

let input;

if( TEST.startsWith( "t" )  ) {
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
