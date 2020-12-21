"use strict";

const fs  = require( 'fs' );
const { getPackedSettings } = require('http2');
const { xor, last, isNull, fromPairs } = require('lodash');
const _   = require( 'lodash' );

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "Tile 2311:",
  "..##.#..#.",
  "##..#.....",
  "#...##..#.",
  "####.#...#",
  "##.##.###.",
  "##...#.###",
  ".#.#.#..##",
  "..#....#..",
  "###...#.#.",
  "..###..###",
  "",
  "Tile 1951:",
  "#.##...##.",
  "#.####...#",
  ".....#..##",
  "#...######",
  ".##.#....#",
  ".###.#####",
  "###.##.##.",
  ".###....#.",
  "..#.#..#.#",
  "#...##.#..",
  "",
  "Tile 1171:",
  "####...##.",
  "#..##.#..#",
  "##.#..#.#.",
  ".###.####.",
  "..###.####",
  ".##....##.",
  ".#...####.",
  "#.##.####.",
  "####..#...",
  ".....##...",
  "",
  "Tile 1427:",
  "###.##.#..",
  ".#..#.##..",
  ".#.##.#..#",
  "#.#.#.##.#",
  "....#...##",
  "...##..##.",
  "...#.#####",
  ".#.####.#.",
  "..#..###.#",
  "..##.#..#.",
  "",
  "Tile 1489:",
  "##.#.#....",
  "..##...#..",
  ".##..##...",
  "..#...#...",
  "#####...#.",
  "#..#.#.#.#",
  "...#.#.#..",
  "##.#...##.",
  "..##.##.##",
  "###.##.#..",
  "",
  "Tile 2473:",
  "#....####.",
  "#..#.##...",
  "#.##..#...",
  "######.#.#",
  ".#...#.#.#",
  ".#########",
  ".###.#..#.",
  "########.#",
  "##...##.#.",
  "..###.#.#.",
  "",
  "Tile 2971:",
  "..#.#....#",
  "#...###...",
  "#.#.###...",
  "##.##..#..",
  ".#####..##",
  ".#..####.#",
  "#..#.#..#.",
  "..####.###",
  "..#.#.###.",
  "...#.#.#.#",
  "",
  "Tile 2729:",
  "...#.#.#.#",
  "####.#....",
  "..#.#.....",
  "....#..#.#",
  ".##..##.#.",
  ".#.####...",
  "####.#.#..",
  "##.####...",
  "##..#.##..",
  "#.##...##.",
  "",
  "Tile 3079:",
  "#.#.#####.",
  ".#..######",
  "..#.......",
  "######....",
  "####.#..#.",
  ".#...#.##.",
  "#.#####.##",
  "..#.###...",
  "..#.......",
  "..#.###...",
  ""
]

let MONSTER = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   "
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

 function getEdgeValues( pixels ) {

  // Edge values are natural first (if edge rotated to top), then reversed (flipped horizontally after rotation to top)

   let edge_values = [];

   edge_values.push( parseInt( pixels.join(""), 2 ) );

   let reverse = _.clone( pixels ).reverse();

   edge_values.push( parseInt( reverse.join(""), 2 ) );

   return( edge_values );
 }

function getEdges( pixels ) {
  let edges = [];

  let top     = [];
  let right   = [];
  let bottom  = [];
  let left    = [];
  
  let height = pixels.length;
  let width  = pixels[0].length;

  for( let x = 0; x < width; x++ ) {
    for( let y = 0; y < height; y++ ) {
      if( y == height - 1 ) {
        top.push( pixels[y][x] );
      }

      if( x == width - 1 ) {
        right.unshift( pixels[y][x] );
      }

      if( y == 0 ) {
        bottom.unshift( pixels[y][x] );
      }

      if( x == 0 ) {
        left.push( pixels[y][x] );
      }
    }
  }

  // log( `top:    ${top},    values: ${getEdgeValues( top )}`);
  // log( `right:  ${right},  values: ${getEdgeValues( right )}`);
  // log( `bottom: ${bottom}, values: ${getEdgeValues( bottom )}`);
  // log( `left:   ${left},   values: ${getEdgeValues( left )}`);
  // log();

  // Note: Order of edge pixels is consistent and from the perspective if you rotated the image fragment so it was at the top.

  edges.push( ...getEdgeValues( top ) );
  edges.push( ...getEdgeValues( right ) );
  edges.push( ...getEdgeValues( bottom ) );
  edges.push( ...getEdgeValues( left ) );

  return( edges);
}

function parseTile( tile_no, tile_lines ) {
  let pixels = [];

  for( let line of tile_lines ) {
    let row = [];

    for( let pixel of line ) {
      row.push( pixel == "#" ? 1 : 0 );
    }

    pixels.unshift( row );
  }

  let tile = {
    number:   tile_no,
    edges:    getEdges( pixels ),
    pixels:   pixels
  }

  // log( `${JSON.stringify( tile )}` );

  return( tile );
}


function parse_data( lines ) {
  let tiles = [];

  let tile_no;
  let tile_lines = [];

  for( let line of lines ) {
    if( line == "" ) {
      let tile = parseTile( tile_no, tile_lines );

      tiles.push( tile );

      tile_no = null;
      tile_lines = [];
    } else {
      let matches = line.match( /^Tile\s(\d*):$/ );

      if( matches ) {
        tile_no = Number( matches[1] );
      } else {
        tile_lines.push( line );
      }
    }
   
  }
  
  // log( tiles );

  return( tiles );
}


/************************************************************************************
 * 
 * Matrix Functions
 * 
 ************************************************************************************/

function outputPixels( heading, pixels ) {
  log( `Photo: ${heading}:` );

  for( let y = pixels.length - 1; y >= 0; y-- ) {
    console.log( pixels[y].map( p => p == 0 ? "." : ( p == 1 ? "#" : "O" ) ).join( "" ) );
  }
}

function rotate90CounterClockwise( mat ) {
  let N = mat.length;

  for( let i = 0; i < N; i++ ) {
    for( let j = 0; j < i; j++ ) {
        let temp = mat[i][j];
        mat[i][j] = mat[j][i];
        mat[j][i] = temp;
    }
  }

  // swap columns
  for( let i = 0; i < N; i++ ) {
    for( let j = 0; j < N / 2; j++ ) {
        let temp = mat[i][j];
        mat[i][j] = mat[i][N - j - 1];
        mat[i][N - j - 1] = temp;
    }
  }
}


function rotateTile90CounterClockwise( tile ) {
  rotate90CounterClockwise( tile.pixels );

  // Rotate the corresponding edge values too
  tile.edges.push( tile.edges.shift() );
  tile.edges.push( tile.edges.shift() );
}


function flipHorizontal( mat ) {
  let N = mat.length;

  for( let y = 0; y < N; y++ ) {
    for( let x = 0; x < N / 2; x ++ ) {
      let temp = mat[y][x];
      mat[y][x] = mat[y][N - 1 - x];
      mat[y][N - 1 - x] = temp;
    }
  }
}


function flipTileHorizontal( tile ) {
  flipHorizontal( tile.pixels );

  let temp = tile.edges[2];
  tile.edges[2] = tile.edges[6];
  tile.edges[6] = temp;

  temp = tile.edges[3];
  tile.edges[3] = tile.edges[7];
  tile.edges[7] = temp;
}


/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

function getNonMatchingEdges( tile, tiles ) {
 
  let other_tiles = tiles.filter( t => t.number != tile.number );

  let other_edges = other_tiles.map( t => t.edges );

  let non_matching_edges = _.difference( tile.edges, ...other_edges );

  non_matching_edges = tile.edges.filter( ( e, idx ) => idx % 2 == 0 && non_matching_edges.includes( e ) );

  return( non_matching_edges );
}


function getCorners( tiles ) {
  let corners = [];

  for( let tile of tiles ) {
    let nonMatchingEdges = getNonMatchingEdges( tile, tiles );

    // log( `tile: ${tile.number}, count: ${nonMatchingEdgeCount}` );
    
    if( nonMatchingEdges.length == 2 ) {
      corners.push( tile.number );
    }
  }

  return( corners );
}

const SIDE_SEQUENCE = [
  "t",
  "r",
  "b",
  "l"
]

function getTileSpec( tile ) {
  let spec = {};

  for( let seq = 0; seq < 4; seq++ ) {
    let key = SIDE_SEQUENCE[seq];
    let edge = tile.edges.slice( seq * 2, seq * 2 + 2 );

    spec[key] = edge;
  }

  return( spec );
}


function specsMatch( tile_spec, spec, nonMatchingEdges ) {
  for( let side of SIDE_SEQUENCE ) {
    if( spec[side] !== null) {
      if( spec[side] === 0 ) {
        if( !_.intersection( tile_spec[side], nonMatchingEdges ).length ) {
          return( false );
        }
      } else {
        if( !_.intersection( tile_spec[side], spec[side] ).length ) {
          return( false );
        }
      }
    }
  }

  return( true );
}


function orientTile( tile, spec, tiles, x, y ) {
  // Spec values:
  // null     => ignore size
  // 0        => must be nonMatching  (outside) edge
  // [ n, r ] => normal and rotated edge value that has to match

  log( `Orienting: ${tile.number}...`) ;
  // log( `\nspec: ${JSON.stringify( spec )}` );
  // log( `y: ${y}, x: ${x}, sides to match: ${sides.length}` );
  // log( `ignores: ${ignores.length}, outers: ${outers.length}, edges: ${edges.length}`)
  
  let nonMatchingEdges = getNonMatchingEdges( tile, tiles );

  log( `   nonMatching: ${JSON.stringify( nonMatchingEdges )}` );

  // Try rotations
  for( let i = 0; i < 4; i++ ) {
    let tile_spec = getTileSpec( tile );

    log( `   tile spec: ${JSON.stringify( tile_spec )}` );
    log( `   specs match [${i}]: ${specsMatch( tile_spec, spec, nonMatchingEdges )}`);

    if( specsMatch( tile_spec, spec, nonMatchingEdges ) ) {
      return;
    }

    rotateTile90CounterClockwise( tile );
  }

  rotateTile90CounterClockwise( tile );

  // Try rotations and flips

  for( let i = 0; i < 4; i++ ) {
    flipTileHorizontal( tile );

    let tile_spec = getTileSpec( tile );

    log( `   tile spec: ${JSON.stringify( tile_spec )}` );
    log( `   specs match [F${i}]: ${specsMatch( tile_spec, spec, nonMatchingEdges )}`);

    if( specsMatch( tile_spec, spec, nonMatchingEdges ) ) {
      return;
    }

    flipTileHorizontal( tile );
    rotateTile90CounterClockwise( tile );
  }

  throw( `CRAPSTIX:  Should have exited before here!` );

}


function assemblePhoto( start_tile, tiles ) {
  // outputPixels( "Start corner: " + start_tile.number, start_tile.pixels );

  let not_placed_yet = [ ...tiles ];

  let match_tile;

  let photo_dim = Math.sqrt( tiles.length );

  let photo = new Array( photo_dim );

  for( let y = 0; y < photo_dim; y ++ ) {
    photo[y] = new Array( photo_dim );
    
    for( let x = 0; x < photo_dim; x++ ) {
      if( y == 0 && x == 0) {
        photo[y][x] = start_tile;

        let spec = { t: null, r: null, b: 0, l: 0 }

        orientTile( start_tile, spec, tiles, x, y );

        not_placed_yet.splice( not_placed_yet.findIndex( t => t.number == start_tile.number ), 1 );
      } else {
        let match_edge  = x == 0 ? photo[y-1][x].edges[0] : photo[y][x-1].edges[2];

        log( `\ny: ${y}, x: ${x}, finding edge: ${match_edge}` );

        let place_tile_index = not_placed_yet.findIndex( t => t.edges.includes( match_edge ) );  // Find tile that matches right size of match_tile

        if( place_tile_index < 0 ) {
          for( let t of not_placed_yet ) {
            console.log( `not placed: ${t.number}, edges: ${t.edges}` );
          }
          throw( `CRAPSTIX:  No matching tile found, y: ${y}, x: ${x}` );
        }

        let place_tile = not_placed_yet[ place_tile_index ];

        log( `\nplace tile: ${place_tile.number}` )

        not_placed_yet.splice( place_tile_index, 1 );

        photo[y][x] = place_tile;

        let t = y == photo_dim - 1 ? 0 : null;
        let r = x == photo_dim - 1 ? 0 : null;
        let b = y == 0 ? 0 : photo[y-1][x].edges.slice( 0, 2 );
        let l = x == 0 ? 0 : photo[y][x-1].edges.slice( 2, 4 );

        let spec = { t, r, b, l };

        log( `\nspec: ${JSON.stringify( spec )}` );

        orientTile( place_tile, spec, tiles, x, y );
      }
    }
  }
  
  return( photo );
}


function constructPhoto( photo_tiles ) {
  let photo = [];

  let height = photo_tiles[0][0].pixels.length;

  for( let y = photo_tiles.length - 1; y >= 0; y-- ) {  
    for( let ty = height - 2; ty >= 1; ty-- ) {
      photo.push( [].concat( ...photo_tiles[y].map( tile => tile.pixels[ty].slice( 1, -1 ) ) ) );
    }
  }

  return( photo )
}


function findSeaMonsters( photo ) {
  let coordinates = [];

  let monster_h = MONSTER.length;
  let monster_w = MONSTER[0].length;

  for( let y = 0; y < photo.length - monster_h; y++ ) {
    for( let x = 0; x < photo[0].length - monster_w; x++ ) {
      let found = true;

      for( let my = monster_h - 1; my >= 0; my-- ) {
        for( let mx = 0; mx < monster_w; mx++ ) {
          if( MONSTER[my][mx] == "#" && photo[y + monster_h - 1 - my][x + mx] != 1 ) {
            found = false;
          }

          if( !found ) {
            break;
          }
        }
      }

      if( found ) {
        coordinates.push( [ y, x ] );
      }
    }
  }

  return( coordinates );
}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

 function part1( day, input ) {
  let answer = 0;

  let corners = getCorners( input );

  answer = corners[0] * corners[1] * corners[2] * corners[3];

  console.log( `Day ${day} answer, part 1: ${answer}` );
 }


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, input ) {
  let answer = 0;

  let tiles = input;

  let corner_number = getCorners( tiles )[0];

  let corner_tile = tiles.find( t => t.number == corner_number );

  let photo_tiles = assemblePhoto( corner_tile, input );

  for( let y = photo_tiles.length - 1; y >= 0; y-- ) {
    log( photo_tiles[y].map( t => t.number) );
  }

  let photo = constructPhoto( photo_tiles );

  // outputPixels( "Photo", photo );

  let monster_coordinates;

  // Try rotations
  for( let i = 0; i < 4; i++ ) {
    monster_coordinates = findSeaMonsters( photo );

    if( monster_coordinates.length ) {
      break;
    }

    rotate90CounterClockwise( photo );
  }

  // Try rotations and flips

  if( !monster_coordinates.length ) {
    rotate90CounterClockwise( photo );

    for( let i = 0; i < 4; i++ ) {
      flipHorizontal( photo );

      monster_coordinates = findSeaMonsters( photo );

      if( monster_coordinates.length ) {
        break;
      }

      flipHorizontal( photo );
      rotate90CounterClockwise( photo );
    }
  }

  // mark found sea monsters
  log( monster_coordinates );

  let monster_h = MONSTER.length;
  let monster_w = MONSTER[0].length;

  for( let coordinates of monster_coordinates ) {
    for( let my = monster_h - 1; my >= 0; my-- ) {
      for( let mx = 0; mx < monster_w; mx++ ) {
        if( MONSTER[my][mx] == "#" ) {
          photo[coordinates[0] + monster_h - 1 - my][coordinates[1] + mx]++;
        }
      }
    }
  }

  outputPixels( "Monsters", photo );

  // calculate roughness

  let roughness = 0;

  for( let y = 0; y < photo.length; y++ ) {
    for( let x = 0; x < photo[0].length; x++ ) {
      if( photo[y][x] == 1 ) {
        roughness++;
      }
    }
  }

  answer = roughness;

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
