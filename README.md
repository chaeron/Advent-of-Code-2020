# Advent of Code 2020 - Solutions

This are my solutions to the 2020 Advent of Code puzzles.

Solutions are coded in JavaScript and are run using NodeJS


## Some thoughts on how to approach/solve the puzzles

Many of the puzzles are easier to solve if you first parse the input data into a more usable format/data structure (ie. arrays/objects)

Nested loops, recursion, modulo arithmetic (remainders) and regular expressions (RegEx) are very useful techniques to understand and use appropriately. RegExes are especially good for parsing of raw input data.

It's best to read the puzzle description carefully, since there are hints that some brute-force approaches will take huge amounts of time to solve the problem! In that case, you need to come up with a more optimized approach to solving the problem.

I created a boilerplate code template for the puzzles since each day has two parts and has both test and real data, both of which have data parsing requirements.  This made it faster to focus on solving each puzzle, using a standardized approach and commands each day a new set of puzzles is released.

For production code, I would use constants to reference related values in entries that are arrays or maybe used objects with more descriptive keys instead of arrays of related values, but since this is for fun I didn't go to the trouble of doing that. Whatever was the most expedient....since the point is to solve the puzzles quickly, and not necessarily document every last little detail. LOL

Enjoy!

## Prerequisites

- NodeJS


## Installation

First install [node.js](http://nodejs.org/), if you are running on Ubuntu. If you are on Apple, then pull the worm out of your apple, and go google instructions on how to install NodeJS. ;-) If you are on Windows, you are not a real developer and you should quit now! LOL

Then:

```sh
$ npm install
```

## Installation

To run a solution for any particular day, you run a command that looks like this:

```sh
$ node src/2020/day#.js {1|2} {t|p}
```
where # = puzzle day

first parameter denotes part 1 or 2
second parameter denotes test or production data.

For example, to run the day 3 puzzle, part 2 using test data you would run:

```sh
$ node src/2020/day3.js 2 t
```

To run the day 12 puzzle, part 1 using final/real puzzle data you would run:

```sh
$ node src/2020/day12.js 1 p
```
