# Advent of Code 2020 - Solutions

This are my solutions to the 2020 Advent of Code puzzles.

Solutions are coded in JavaScript and are run using NodeJS


## Some thoughts on how to approach/solve the puzzles

Many of the puzzles are easier to solve if you first parse the input data into a more usable format/data structure (ie. arrays/objects)

Nested loops, Recursion, modulo arithmetic (remainders) and regular expressions (RegEx) are very useful techniques to understand and use appropriately. RegExes are especially good for parsing of raw input data.

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
