"use strict";

const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "Player 1:",
  "9",
  "2",
  "6",
  "3",
  "1",
  "",
  "Player 2:",
  "5",
  "8",
  "4",
  "7",
  "10",
  ""
]

const INPUT_TEST_INFINITE = [
  "Player 1:",
  "43",
  "19",
  "",
  "Player 2:",
  "2",
  "29",
  "14",
  ""
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

  let player;

  for( let line of lines ) {
    if( line == "" ) {
      parsed.push( player );
    } else {
      let matched = line.match( /^Player\s(\d*):$/ );

      if( matched ) {
        player = { number: Number( matched[1] ), cards: [] }
      } else {
        player.cards.push( Number( line ) );
      }
    }

  }
  
  log( parsed );

  return( parsed );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function previousRoundPlayed( players, players_prior_rounds ) {
  if( players_prior_rounds.length == 0  ) {
    return( false );
  }

  for( let prior_players of players_prior_rounds ) {
    if( prior_players.length != players.length ) {
      return( false );
    }

    let all_players_match = true;

    for( let player of players ) {
      let prior_player = prior_players.find( pp => pp.number == player.number );

      if( !prior_player ) {
        return( false );
      }

      if ( !( player.cards.length === prior_player.cards.length && player.cards.every( ( card, idx ) => card === prior_player.cards[ idx ] ) ) ) {
        all_players_match = false;
        break;
      }
    }

    if( all_players_match ) {
      return( true );
    } 
  }
  
  return( false );
}


function mustPlaySubgame( cards, players ) {
  for( let i = 0; i < cards.length; i++ ) {
    if( players[i].cards.length < cards[i] ) {
      return( false );
    }
  }

  return( true );
}


function playGame( players, recursive, prior_rounds, level ) {
  let remaining_players = players.filter( p => p.cards.length > 0 );

  let round = 1;

  let indent = "   ".repeat( level );

  log( `\n${indent}Game Start, level: ${level}` );

  while( remaining_players.length > 1 ) {
    if( LOG ) {
      log( `\n${indent}Round: ${round}` );

      for( let player of remaining_players ) {
        log( `${indent}   Player: ${player.number}, cards: ${player.cards}` );
      }
    }

    if( recursive && previousRoundPlayed( players, prior_rounds )) {
      log( `${indent}   Previous round played!` );
      log( `${indent}   Winner: ${remaining_players[0].number}` );
      return( remaining_players[0] );
    }

    prior_rounds.push( _.cloneDeep( remaining_players ) );    // Save this round as already played

    let played_cards = remaining_players.map( p => p.cards.shift() );

    log( `${indent}   Cards played: ${played_cards}` );

    // Play subgame?

    if( recursive && mustPlaySubgame( played_cards, remaining_players ) ) {
      let subgame_players = _.cloneDeep( remaining_players );

      for( let i = 0; i < played_cards.length; i++ ) {
        subgame_players[i].cards.splice( played_cards[i] );
      }

      let winner = playGame( subgame_players, true, [], level + 1 );

      let winner_idx = remaining_players.findIndex( p => p.number == winner.number );

      remaining_players[winner_idx].cards.push( played_cards[ winner_idx ] );

      played_cards.splice( winner_idx, 1 ).sort( ( a, b ) => b - a );

      remaining_players[winner_idx].cards.push( ...played_cards );

      log( `${indent}   Subgame Winner: ${remaining_players[winner_idx].number}` );
    } else {
      let winning_card = Math.max( ...played_cards );

      let winner = remaining_players[ played_cards.indexOf( winning_card ) ];

      log( `${indent}   Winner: ${winner.number}` );

      played_cards.sort( ( a, b ) => b - a );

      winner.cards.push( ...played_cards );
    }

    remaining_players = remaining_players.filter( p => p.cards.length > 0 );

    round++;
  }

  let winner = players.find( p => p.cards.length > 0 );

  return( winner );
}


function calculateScore( cards ) {
  let score = cards.map( ( c, idx ) => c * ( cards.length - idx ) ).reduce( ( a, b ) => a + b, 0 );

  return( score );
}

/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let players = input;

  let winner = playGame( players, false, [], 0 );

  log( `\nWinning player: ${winner.number}, cards: ${winner.cards}`);

  answer = calculateScore( winner.cards );

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let players = input;

  let winner = playGame( players, true, [], 0 );

  log( `\nWinning player: ${winner.number}, cards: ${winner.cards}`);

  answer = calculateScore( winner.cards );

  
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
