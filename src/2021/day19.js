"use strict";

const fs  = require( 'fs' );
const { over } = require('lodash');
const _   = require( 'lodash' );
const { off } = require('process');

/************************************************************************************
 * 
 * Input Data
 * 
 ************************************************************************************/

const INPUT_TEST = [
  "--- scanner 0 ---",
  "404,-588,-901",
  "528,-643,409",
  "-838,591,734",
  "390,-675,-793",
  "-537,-823,-458",
  "-485,-357,347",
  "-345,-311,381",
  "-661,-816,-575",
  "-876,649,763",
  "-618,-824,-621",
  "553,345,-567",
  "474,580,667",
  "-447,-329,318",
  "-584,868,-557",
  "544,-627,-890",
  "564,392,-477",
  "455,729,728",
  "-892,524,684",
  "-689,845,-530",
  "423,-701,434",
  "7,-33,-71",
  "630,319,-379",
  "443,580,662",
  "-789,900,-551",
  "459,-707,401",
  "",
  "--- scanner 1 ---",
  "686,422,578",
  "605,423,415",
  "515,917,-361",
  "-336,658,858",
  "95,138,22",
  "-476,619,847",
  "-340,-569,-846",
  "567,-361,727",
  "-460,603,-452",
  "669,-402,600",
  "729,430,532",
  "-500,-761,534",
  "-322,571,750",
  "-466,-666,-811",
  "-429,-592,574",
  "-355,545,-477",
  "703,-491,-529",
  "-328,-685,520",
  "413,935,-424",
  "-391,539,-444",
  "586,-435,557",
  "-364,-763,-893",
  "807,-499,-711",
  "755,-354,-619",
  "553,889,-390",
  "",
  "--- scanner 2 ---",
  "649,640,665",
  "682,-795,504",
  "-784,533,-524",
  "-644,584,-595",
  "-588,-843,648",
  "-30,6,44",
  "-674,560,763",
  "500,723,-460",
  "609,671,-379",
  "-555,-800,653",
  "-675,-892,-343",
  "697,-426,-610",
  "578,704,681",
  "493,664,-388",
  "-671,-858,530",
  "-667,343,800",
  "571,-461,-707",
  "-138,-166,112",
  "-889,563,-600",
  "646,-828,498",
  "640,759,510",
  "-630,509,768",
  "-681,-892,-333",
  "673,-379,-804",
  "-742,-814,-386",
  "577,-820,562",
  "",
  "--- scanner 3 ---",
  "-589,542,597",
  "605,-692,669",
  "-500,565,-823",
  "-660,373,557",
  "-458,-679,-417",
  "-488,449,543",
  "-626,468,-788",
  "338,-750,-386",
  "528,-832,-391",
  "562,-778,733",
  "-938,-730,414",
  "543,643,-506",
  "-524,371,-870",
  "407,773,750",
  "-104,29,83",
  "378,-903,-323",
  "-778,-728,485",
  "426,699,580",
  "-438,-605,-362",
  "-469,-447,-387",
  "509,732,623",
  "647,635,-688",
  "-868,-804,481",
  "614,-800,639",
  "595,780,-596",
  "",
  "--- scanner 4 ---",
  "727,592,562",
  "-293,-554,779",
  "441,611,-461",
  "-714,465,-776",
  "-743,427,-804",
  "-660,-479,-426",
  "832,-632,460",
  "927,-485,-438",
  "408,393,-506",
  "466,436,-512",
  "110,16,151",
  "-258,-428,682",
  "-393,719,612",
  "-211,-452,876",
  "808,-476,-593",
  "-575,615,604",
  "-485,667,467",
  "-680,325,-822",
  "-627,-443,-432",
  "872,-547,-609",
  "833,512,582",
  "807,604,487",
  "839,-516,451",
  "891,-625,532",
  "-652,-548,-490",
  "30,-46,-14"
]


const DAY = process.argv[1].match( /day(\d*)\.js$/ )[1];

const INPUT_REAL = fs.readFileSync( `./src/2021/data/day${DAY}.data` ).toString().split( "\n" );


/************************************************************************************
 * 
 * Constants
 * 
 ************************************************************************************/

const X = 0;
const Y = 1;
const Z = 2;

let ROTATION_MATRICES = [];


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
  let scanners = [];
  let beacons = null;;

  for( let line of lines ) {
    if( line.length ) {
      if( line.startsWith( "--- scanner" ) ) {
        if( beacons ) {
          scanners.push( beacons );
        }

        beacons = [];
      } else {
        let beacon = line.split( "," ).map( b => parseInt( b ) );
        beacons.push( beacon );
      }
    }
  }

  scanners.push( beacons );
  
  // log( scanners );

  return( scanners );
}


/************************************************************************************
 * 
 * Rotation Functions
 * 
 ************************************************************************************/

// Inspired by https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm

function getRotationMatrix( pitch, roll, yaw ) {
  // pitch/roll/yaw are in radians!!

  let  cosa = Math.round( Math.cos(yaw) );
  let  sina = Math.round( Math.sin(yaw) );

  let  cosb = Math.round( Math.cos(pitch) );
  let  sinb = Math.round( Math.sin(pitch) );

  let  cosc = Math.round( Math.cos(roll) );
  let  sinc = Math.round( Math.sin(roll) );

  let  Axx = Math.round( cosa*cosb );
  let  Axy = Math.round( cosa*sinb*sinc - sina*cosc );
  let  Axz = Math.round( cosa*sinb*cosc + sina*sinc );

  let  Ayx = Math.round( sina*cosb );
  let  Ayy = Math.round( sina*sinb*sinc + cosa*cosc );
  let  Ayz = Math.round( sina*sinb*cosc - cosa*sinc );

  let  Azx = Math.round( -sinb );
  let  Azy = Math.round( cosb*sinc );
  let  Azz = Math.round( cosb*cosc );

  let matrix = {
    Axx,
    Axy,
    Axz,
    Ayx,
    Ayy,
    Ayz,
    Azx,
    Azy,
    Azz,
  }

  return( matrix );
}


function rotatePoint( point, matrix ) {
  let  px = point[X];
  let  py = point[Y];
  let  pz = point[Z];

  let rotated = [
    matrix.Axx*px + matrix.Axy*py + matrix.Axz*pz,
    matrix.Ayx*px + matrix.Ayy*py + matrix.Ayz*pz,
    matrix.Azx*px + matrix.Azy*py + matrix.Azz*pz
  ]

  return( rotated );
}


function generateRotationMatrices() {
  let rotation_angles = [ 0, 90, 180, 270 ];

  let to_radians = Math.PI / 180;

  for( let x of rotation_angles ) {
    for( let y of rotation_angles ) {
      for( let z of rotation_angles ) {
        // convert degrees to radians here

        ROTATION_MATRICES.push( getRotationMatrix( x * to_radians, y * to_radians, z * to_radians ) );
      }
    }
  }
}



/************************************************************************************
 * 
 * Puzzle Implementation Functions
 * 
 ************************************************************************************/

// Calculate and save distances for all pairs of beacon points for each scanner

function getDistances( scanners ) {
  let scanner_distances = [];

  for( let beacons of scanners ) {
    let distances = [];

    
    for( let a = 0; a < beacons.length; a++  ) {
      let beacon1 = beacons[ a ];
      
      let beacon_distances = [];

      for( let b = 0; b < beacons.length; b++  ) {
        let beacon2 = beacons[ b ];

        let distance = Math.pow( beacon1[X] - beacon2[X], 2 ) + Math.pow( beacon1[Y] - beacon2[Y], 2 ) + Math.pow( beacon1[Z] - beacon2[Z], 2 );  // no need to take square root for actual distance!

        if( distance ) {
          beacon_distances.push( distance );
        }
      }

      distances.push( beacon_distances );
    }

    scanner_distances.push( distances );
  }
  
  return( scanner_distances );
}


// If 11 distances match between scanners, then they have at least 12 common beacons. Save the pairs of common beacons when this happens

function getOverlappingScanners( scanner_distances, scanners ) {
  let overlappings = [];

  for( let a = 0; a < scanner_distances.length; a++  ) {
    for( let b = a; b < scanner_distances.length; b++  ) {
      if( a != b ) {
        let common_beacons_count = 0;
        let common_beacons = [];

        for( let abd_idx = 0; abd_idx < scanner_distances[a].length; abd_idx++ ) {
          let a_beacon_dist = scanner_distances[a][abd_idx];

          for( let bbd_idx = 0; bbd_idx < scanner_distances[b].length; bbd_idx++ ) {
            let b_beacon_dist = scanner_distances[b][bbd_idx];

            if( _.intersection( a_beacon_dist, b_beacon_dist ).length == 11 ) {
              common_beacons_count++;
              common_beacons.push( [ scanners[a][abd_idx], scanners[b][bbd_idx] ] );    // Save common beacon pair
            }
          }
        }

        // log( `${a},${b} => ${common_beacons_count}`)

        if( common_beacons_count == 12 ) {
          overlappings.push( { overlapping: [ a, b ], common_beacons: common_beacons } );
        }

      }
    }
  }

  return( overlappings );
}


function findOffsetAndRotation( overlapping_scanners, from_idx, to_idx ) {
  let matrix = null;
  let offset = null;

  // Iterate through every possible rotation, then see if all of the common beacons have same offset, if they do, we've figured out the offset and rotation matrix needed!

  for( let matrix_idx = 0; matrix_idx < ROTATION_MATRICES.length; matrix_idx++ ) {
   let offsets = overlapping_scanners.common_beacons.map( 
     function ( pair ) { 
       let r = rotatePoint( pair[to_idx], ROTATION_MATRICES[matrix_idx] ); 
       let f = pair[from_idx]; 
       return( [ f[X] - r[X], f[Y] - r[Y], f[Z] - r[Z] ] ); 
      } 
    );

    // log( offsets )

    let unique_offsets = _.uniqWith( offsets, _.isEqual );

    if( unique_offsets.length == 1 ) {
      matrix = matrix_idx;
      offset = unique_offsets[0];
      break;
    }
  }

  return( [ offset, matrix ] );
}


// Calculate the scanner offsets

function getScannerOffsets( scanners ) {
  let scanner_distances = getDistances( scanners );

  let overlapping_scanners = getOverlappingScanners( scanner_distances, scanners );

  for( let os of overlapping_scanners ) {
    log( os.overlapping );
  }

  // Start with scanner 0, which has no rotation (matrix 0) and is at origin (0. 0. 0 )
  let scanner_offsets = {
    0: { 
      offset: [ 0, 0, 0 ],
      matrix: 0
    }
  }

  let done = false;

  while( !done ) {
    let froms = Object.keys( scanner_offsets ).map( key => parseInt( key ) );

    for( let from of froms ) {
      let os_entry = overlapping_scanners.find( os => os.overlapping.includes( from ) );

      if( os_entry ) {
        let to_idx   = os_entry.overlapping[0] == from ? 1 : 0;   // Figure out if to is 1st or 2nd entry in the overlapping array
        let from_idx = os_entry.overlapping[0] == from ? 0 : 1;   // Figure out if from is 1st or 2nd entry in the overlapping array

        let to = os_entry.overlapping[ to_idx ];

        if( !scanner_offsets[to] ) {

          log( `${from} ==> ${to}, ` );

          let [ offset, matrix ] = findOffsetAndRotation( os_entry, from_idx, to_idx );

          scanner_offsets[to] = { offset, matrix };

          _.pull( overlapping_scanners, os_entry ); // Remove the overlapping_scanners entry we just processed

          // Adjust the to beacon points in overlapping_scanners entries using found offset and matrix if the to will become a from

          if( overlapping_scanners.find( os => os.overlapping.includes( to ) ) ) {
            for( let to_entry of overlapping_scanners.filter( os => os.overlapping.includes( to ) ) ) {
              let to_idx = to_entry.overlapping[0] == to ? 0 : 1;

              for( let pair of to_entry.common_beacons ) {
                let rotated = rotatePoint( pair[ to_idx ], ROTATION_MATRICES[matrix] );

                pair[ to_idx ] = [ rotated[X] + offset[X], rotated[Y] + offset[Y], rotated[Z] + offset[Z] ];
              }
            }
          }

          break;
        } else {
          _.pull( overlapping_scanners, os_entry );   // We already adjusted the beacons for to, so just remove the overlapping_scanners entry
        }
      }
    }

    done = Object.keys( scanner_offsets ).length >= scanners.length;
  }

  log( scanner_offsets );

  return( scanner_offsets );

}


/************************************************************************************
 * 
 * Part 1 Function
 * 
 ************************************************************************************/

function part1( day, scanners ) {
  let answer = 0;

  let scanner_offsets = getScannerOffsets( scanners );

  let beacons_map = {};

  for( let scanner = 0; scanner < scanners.length; scanner++ ) {
    let { offset, matrix } = scanner_offsets[ scanner ];
      for( let beacon of scanners[scanner] ) {
        let rotated  = rotatePoint( beacon, ROTATION_MATRICES[matrix] );
        let absolute = [ rotated[X] + offset[X], rotated[Y] + offset[Y], rotated[Z] + offset[Z] ];

        beacons_map[ absolute ] = true;
      }
  }

  answer = Object.keys( beacons_map ).length;

  console.log( `Day ${day} answer, part 1: ${answer}` );
}


 /************************************************************************************
 * 
 * Part 2 Function
 * 
 ************************************************************************************/

function part2( day, scanners ) {
  let answer = 0;

  let scanner_offsets = getScannerOffsets( scanners );

  let min_distance = -Infinity;

  for( let a = 0; a < Object.keys( scanner_offsets ).length; a++ ) {
    for( let b = a + 1; b < Object.keys( scanner_offsets ).length; b++ ) {
      let a_pos = scanner_offsets[ a ].offset;
      let b_pos = scanner_offsets[ b ].offset;

      let distance = Math.abs( a_pos[X] - b_pos[X] ) + Math.abs( a_pos[Y] - b_pos[Y] ) + Math.abs( a_pos[Z] - b_pos[Z] );   // Manhattan distance

      if( distance > min_distance ) {
        min_distance = distance;
      }
    }
  }

  answer = min_distance;
  
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

generateRotationMatrices();

PART == "1" ? part1( DAY, PARSED ) : part2( DAY, PARSED );
