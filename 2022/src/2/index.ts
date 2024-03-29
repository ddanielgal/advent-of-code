import * as fs from "fs";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import forEachLine from "../modules/reader.js";

enum Hand {
  Rock,
  Paper,
  Scissors,
}

enum Result {
  Win,
  Lose,
  Draw,
}

function handScore(hand: Hand): number {
  return { [Hand.Rock]: 1, [Hand.Paper]: 2, [Hand.Scissors]: 3 }[hand];
}

function resultScore(result: Result): number {
  return { [Result.Win]: 6, [Result.Draw]: 3, [Result.Lose]: 0 }[result];
}

function opponentPrediction(letter: string) {
  return { A: Hand.Rock, B: Hand.Paper, C: Hand.Scissors }[letter];
}

function counterPrediction(letter: string) {
  return { X: Hand.Rock, Y: Hand.Paper, Z: Hand.Scissors }[letter];
}

function resultPrediction(letter:string) {
    return { X: Result.Lose, Y: Result.Draw, Z: Result.Win }[letter];
}

/**
 * @returns {Result} The result of the game from the perspective of the first player.
 */
function play(a: Hand, b: Hand): Result {
  if (a === b) {
    return Result.Draw;
  }
  return (a + 1) % 3 === b ? Result.Lose : Result.Win;
}

function playInverse(a:Hand,b:Result) {
    if (b === Result.Draw) {
        return a;
    }
    if (b === Result.Win) {
        return (a + 1) % 3;
    }
    if (b === Result.Lose) {
        return (a + 2) % 3;
    }
}

type State = { strategy: [Hand, Result][] };

const store = create<State>()(immer(() => ({ strategy: [] })));

const set = store.setState;

function addStrategy(a: Hand, b: Result) {
  set((state) => {
    state.strategy.push([a, b]);
  });
}

function initialize(file: fs.PathLike) {
  forEachLine(file, (line) => {
    const [a, b] = line.split(" ");
    addStrategy(opponentPrediction(a), resultPrediction(b));
  });
}

const selectHumanReadable = (state: State) =>
  state.strategy.map((strat) => strat.map((hand) => Hand[hand]));

const selectGameScore = (state: State) =>
  state.strategy.reduce(
    (acc, [a, b]) => acc + resultScore(b) + handScore(playInverse(a, b)),
    0
  );

export default function main(file: fs.PathLike) {
  initialize(file);
  console.log(selectGameScore(store.getState()));
}
