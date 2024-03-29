import create from "zustand";
import { immer } from "zustand/middleware/immer";
import * as fs from "fs";
import lodash from "lodash";
import forEachLine from "../modules/reader.js";

type Elf = number[];
type State = { elves: Elf[] };

const useStore = create<State>()(immer(() => ({ elves: [] })));

const set = useStore.setState;
const get = useStore.getState;

const addElf = (elf: Elf = []) => {
  set((state) => {
    state.elves.push(elf);
  });
};

const addSnack = (elfIndex: number, snack: number) => {
  set((state) => {
    state.elves[elfIndex].push(snack);
  });
};

const initialize = (file: fs.PathLike) => {
  addElf();
  forEachLine(file, (line) => {
    if (!line) {
      addElf();
      return;
    }
    addSnack(get().elves.length - 1, Number(line));
  });
};

const selectSums = (state: State) =>
  state.elves.map((elf) => elf.reduce(lodash.add));

const selectMax = (state: State) => Math.max(...selectSums(state));

const selectSortedSums = (state: State) =>
  lodash.sortBy(selectSums(state)).reverse();

const selectSumOfTopThreeSums = (state: State) => {
  const [first, second, third] = selectSortedSums(state);
  return lodash.sum([first, second, third]);
};

// main

initialize("public/1/input.txt");
console.log(selectSumOfTopThreeSums(useStore.getState()));
