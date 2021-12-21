"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "Player 1 starting position: 4",
  "Player 2 starting position: 8"
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
  let parsed = [];

  for( let line of lines ) {

    let splits = line.split( ' ' );

    let starting = parseInt( splits[ splits.length -1 ] );

    parsed.push( starting );
  }
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

// Went to all the work of creating a game class in the hopes that it would be reused in part 2, no such luck! LOL

 class Game {
  constructor( player_start_positions, max_dice_value, roll_num_times, winning_score, board_size ) {
    this.players = [];

    for( let start_pos of player_start_positions ) {
      this.players.push( {
        pos:     start_pos - 1,     // shift so we're from 0 - board_size - 1
        score:    0,
        winner: false
      })
    }

    this.dice = {
      next_dice_value:   1,
      max_dice_value:    max_dice_value,
      roll_num_times:    roll_num_times,
      dice_rolls:        0
    }

    this.winning_score = winning_score;
    this.board_size    = board_size;
  }

  getLosingPlayerScore() {
    let losing_player = this.players.find( p => !p.winner );

    return( losing_player.score );
  }


  getNumDiceRolls() {
    return( this.dice.dice_rolls );
  }


  rollDice() {
    let values = [];

    for( let i = 1; i <= this.dice.roll_num_times; i++ ) {
      values.push( this.dice.next_dice_value );

      this.dice.next_dice_value++;

      if( this.dice.next_dice_value > this.dice.max_dice_value ) {
        this.dice.next_dice_value = 1;
      }
    }

    this.dice.dice_rolls += this.dice.roll_num_times;

    return( values );
  }

  playGame() {
    let won = false;

    while( !won ) {
      for( let player of this.players ) {
        let values = this.rollDice();

        let values_sum = values.reduce( ( s, c ) => s + c, 0 );

        player.pos    = ( player.pos + values_sum ) % this.board_size;
        player.score += player.pos + 1;                                 // Shift back so we're from 1 - board_size

        if( player.score >= this.winning_score ) {
          player.winner = true;
          won           = true;

          break;
        }
      }
    }
  }
}


function playUsingDiracDice( positions, scores, player, roll_frequencies, cache ) {
  let wins = [ 0, 0 ];

  let cached = cache[ [ positions, scores, player ] ];

  if( cached ) {
    return( cached );
  } else {
    for( let [ roll, freq ] of roll_frequencies ) {    
      let new_pos = ( positions[ player ] + roll ) % 10;
      let new_score = scores[ player ] + new_pos + 1;

      if( new_score >= 21 ) {
        wins[ player ] += freq;
      } else {
        let new_positions = player ? [ positions[0], new_pos ] : [ new_pos, positions[1] ];
        let new_scores    = player ? [ scores[0], new_score ] : [ new_score, scores[1] ];

        let new_wins      = playUsingDiracDice( new_positions, new_scores, 1 - player, roll_frequencies, cache );

        wins = [ new_wins[0] * freq + wins[0], new_wins[1] * freq + wins[1] ];
      }
    }
  }

  cache[ [ positions, scores, player ] ] = wins;

  return( wins );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, player_start_positions ) {
  let answer = 0;

  let game = new Game( player_start_positions, 100, 3, 1000, 10 );

  game.playGame();

  log( game );

  answer = game.getLosingPlayerScore() * game.getNumDiceRolls();

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, player_start_positions ) {
  let answer = 0;

  // Calculate the roll frequencies for all sums of three rolls

  let roll_frequencies = new Map();
  
  for( let x = 1; x <= 3; x++ ) {
    for( let y = 1; y <= 3; y++ ) {
      for( let z = 1; z <= 3; z++ ) {
        let sum = x + y + z;

        if( roll_frequencies.get( sum ) ) {
          roll_frequencies.set( sum, roll_frequencies.get( sum ) + 1 );
        } else {
          roll_frequencies.set( sum, 1 );
        }
      }
    }
  }

  log( roll_frequencies );

  // Gotta decrease starting positions by 1, since we use a 0 based board!

  let initial_start_positions = [ player_start_positions[0] - 1, player_start_positions[1] - 1 ];
  let initial_scores = [ 0, 0 ];
  let starting_player = 0;

  let wins = playUsingDiracDice( initial_start_positions, initial_scores, starting_player, roll_frequencies, {} );

  log( wins );

  answer = Math.max( ...wins );
  
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
