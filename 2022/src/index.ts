import create from "zustand";
import { immer } from "zustand/middleware/immer";
import * as fs from "fs";
import LineByLine from "n-readlines";
import lodash from "lodash";

type Elf = number[];
type State = { elves: Elf[] };

const useStore = create<State>()(immer(() => ({ elves: [] })));

const set = useStore.setState;

const addElf = (elf: Elf) => {
  set((state) => {
    state.elves.push(elf);
  });
};

const initialize = (file: fs.PathLike) => {
  const input = new LineByLine(file);
  let elf: Elf = [];
  for (let line = input.next(); line; line = input.next()) {
    if (line.toString() === "") {
      addElf(elf);
      elf = [];
    } else {
      elf.push(Number(line.toString()));
    }
  }
};

const selectSums = (state: State) =>
  state.elves.map((elf) => elf.reduce(lodash.add));

const selectMax = (state: State) => Math.max(...selectSums(state));

// main

initialize("public/input.txt");
console.log(selectMax(useStore.getState()));
