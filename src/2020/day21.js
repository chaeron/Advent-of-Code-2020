"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "mxmxvkd kfcds sqjhc nhms (contains dairy, fish)",
  "trh fvjkl sbzzf mxmxvkd (contains dairy)",
  "sqjhc fvjkl (contains soy)",
  "sqjhc mxmxvkd sbzzf (contains fish)",
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2020/data/day${DAY}.data` ).toString().split( "\n" );


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

    let matches = line.match( /^([a-z ]*) \(contains ([a-z ,]*)\)$/ );

    let ingredients = matches[1].split( " " ).sort();
    let allergens   = matches[2].split( ", " ).sort();

    let entry = { ingredients, allergens };

    parsed.push( entry );
  }
  
  log( JSON.stringify( parsed, null, 2 ) );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function getAllergenIngredientPairs( allergens, foods_input ) {
  let pairs = [];

  let foods = _.cloneDeep( foods_input );

  let a = [ ...allergens ];

  while( a.length > 0 ) {
    for( let allergen of a ) {

      let foods_with_allergen = foods.filter( f => f.allergens.includes( allergen ) );

      let common_foods;

      if( foods_with_allergen.length > 1 ) {
        common_foods = _.intersection( ...foods_with_allergen.map( f => f.ingredients ) );
      } else {
        common_foods = foods_with_allergen[0].ingredients;
      }

      if( common_foods.length == 1 ) {
        pairs.push( {
          ingredient: common_foods[0],
          allergen:   allergen
        } );

        a.splice( a.indexOf( allergen ), 1 );

        for( let food of foods ) {
          let idx = food.ingredients.indexOf( common_foods[0] );

          if( idx >= 0 ) {
            food.ingredients.splice( idx, 1 );
          }
        }

        break;
      }
    }
  }

  return( pairs );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let foods = input;

  let allergens = _.uniq( [].concat( ...foods.map( f => f.allergens ) ) ).sort();

  log( allergens );

  let pairs = getAllergenIngredientPairs( allergens, foods );

  log( JSON.stringify( pairs, null, 2 ) );

  let allergic_ingredients = pairs.map( p => p.ingredient );

  let non_allergic_ingredients = _.uniq( [].concat( ...foods.map( f => f.ingredients ) ) ).filter( f => !allergic_ingredients.includes( f ) );

  let non_allergic_count = 0;

  for( let ingredient of non_allergic_ingredients ) {
   non_allergic_count += foods.filter( f => f.ingredients.includes( ingredient ) ).length;
  }

  answer = non_allergic_count;

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let foods = input;

  let allergens = _.uniq( [].concat( ...foods.map( f => f.allergens ) ) ).sort();

  log( allergens );

  let pairs = getAllergenIngredientPairs( allergens, foods );

  pairs.sort( ( a, b ) => a.allergen < b.allergen ? -1 : ( a.allergen > b.allergen ? 1 : 0 ) );

  log( JSON.stringify( pairs, null, 2 ) );

  let canonical_dangerous_ingredient_list = pairs.map( p => p.ingredient ).join( "," );

  answer = canonical_dangerous_ingredient_list;
  
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
  input = INPUT_TEST;
} else {
  input = INPUT_REAL;
}

const PARSED = parse_data( input );

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
