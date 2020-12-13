"use strict";

const fs  = require( 'fs' );

const INPUT_TEST = [
  "BFFFBBFRRR",
  "FFFBBBFRRR",
  "BBFFBBFRLL"
]

const INPUT = fs.readFileSync( './src/2020/data/day5.data' ).toString().split( "\n" );

// console.log( JSON.stringify( INPUT, null, 2 ) );


function getRowSeatNumbers( input ) {
  let matches = input.match( /^([FB]{7})([RL]{3})$/ );

  let row_binary  = matches[1].replace( /F/g, "0" ).replace( /B/g, "1" );
  let seat_binary = matches[2].replace( /L/g, "0" ).replace( /R/g, "1" );

  let row  = parseInt( row_binary, 2 );
  let seat = parseInt( seat_binary, 2 );

  return( [ row, seat ] );
}


let part = 2;

if( part == 1 ) {

  let max_id = 0;

  for( let str of INPUT ) {
    let [ row, seat ] = getRowSeatNumbers( str );

    let seat_id = row * 8 + seat;

    if( seat_id > max_id ) {
      max_id = seat_id;
    }
  }

  console.log( `Day 5 answer, part ${part}: ${max_id}` );
} else {
  let seats = [];

  for( let str of INPUT ) {
    let [ row, seat ] = getRowSeatNumbers( str );

    let seat_id = row * 8 + seat;

    seats.push( seat_id );
  }

  seats.sort( ( a, b ) => a - b );

  // console.log( JSON.stringify( seats, null, 2 ) );

  let my_seat;

  for( let i = 0; i < seats.length - 1; i++ ) {
    if( seats[i] != seats[i + 1] - 1 ) {
      my_seat = seats[i] + 1;
    }
  }

  console.log( `Day 5 answer, part ${part}: ${my_seat}` );
}