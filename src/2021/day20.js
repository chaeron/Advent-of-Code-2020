"use strict";

const { count } = require('console');
const fs  = require( 'fs' );
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##",
  "#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###",
  ".######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.",
  ".#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....",
  ".#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..",
  "...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....",
  "..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#",
  "",
  "#..#.",
  "#....",
  "##..#",
  "..#..",
  "..###"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

let ALGORITHM_NUMBER_OFFSETS = [
  [ -1, -1 ],
  [ -1, 0 ],
  [ -1, 1 ],
  [ 0, -1 ],
  [ 0, 0 ],
  [ 0, 1 ],
  [ 1, -1 ],
  [ 1, 0 ],
  [ 1, 1 ]
]

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

  let algorithm = [];
  let image = [];

  let parsing_algorithm = true;

  for( let line of lines ) {
    if( line.length ) {
      if( parsing_algorithm ) {
        algorithm = [ ...algorithm, ...line.split( '' ) ];
      } else {
        image.push( line.split( '' ) );
      }
    } else {
      parsing_algorithm = false;
    }
  }

  let game = {
    algorithm,
    image,
    gen:    0
  }
  
  // log( JSON.stringify( algorithm ) );
  // showImage( game );
  // log( algorithm.length );

  return( game );
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function getPixel( x, y, image, out_of_bounds_pixel ) {
  let pixel = out_of_bounds_pixel;

  if( y >= 0 && y < image.length && x >= 0 && x < image[0].length ) {
    pixel = image[y][x];
  }

  return( pixel );
}


function getNewPixel( x, y, game, out_of_bounds_pixel ) {
  let number = "";

  let image = game.image;

  for( let offset of ALGORITHM_NUMBER_OFFSETS ) {
    number += getPixel( x + offset[1], y + offset[0], image, out_of_bounds_pixel ) == "#" ? "1" : "0";
  }

  // log( `${x},${y}` )
  // log( number.substring( 0, 3 ) );
  // log( number.substring( 3, 6 ) );
  // log( number.substring( 6, 9 ) );
  // log( "" );


  number = parseInt( number, 2 );

  return( game.algorithm[number] );
}


function enhanceImage( game ) {
  let image = game.image;
  let new_image = [];

  game.gen++;

  // expand new image by 2 in every direction

  for( let y = 0; y < image.length + 2; y++ ) {
    new_image.push( ( new Array( image[0].length + 2 ) ).fill( "." ) );
  }

  let out_of_bounds_pixel = game.algorithm[0] == "." ? "." : ( game.gen % 2 ? "." : "#" );

  log( `\ngen: ${game.gen}, ${game.algorithm[0]}, ${out_of_bounds_pixel}, image: ${image.length}x${image[0].length}, new: ${new_image.length}x${new_image[0].length}`);


  for( let y = 0; y < new_image.length; y++ ) {
    for( let x = 0; x < new_image[0].length; x++ ) {
      new_image[y][x] = getNewPixel( x - 1, y - 1, game, out_of_bounds_pixel );
    }
  }

  game.image = new_image;

  showImage( game )
}


function countLitPixels( game ) {
  let count = 0;

  let image = game.image;

  for( let y = 0; y < image.length; y++ ) {
    for( let x = 0; x < image[0].length; x++ ) {
      if( image[y][x] == "#" ) {
        count++;
      }
    }
  }

  return( count );
}


function showImage( game ) {
  let image = game.image;

  log( "" );

  for( let y = 0; y < image.length; y++ ) {
    log( image[y].join( "" ) );
  }
}

/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, game ) {
  let answer = 0;

  enhanceImage( game );
  enhanceImage( game );

  answer = countLitPixels( game );

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, game ) {
  let answer = 0;

  for( let i = 1; i <= 50; i++ ) {
    enhanceImage( game );
  }

  answer = countLitPixels( game );
  
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
