import lodash from "lodash";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import forEachLine from "../modules/reader.js";

type Section = number;

type Elf = Section[];

type Pair = [Elf, Elf];

type State = {
  pairs: Pair[];
};

const useStore = create<State>()(
  immer(() => ({
    pairs: [],
  }))
);

const set = useStore.setState;
const get = useStore.getState;

function createSection(begin: number, end: number) {
  return lodash.range(begin, end + 1);
}

function parseSection(rawSection: string) {
  const [begin, end] = rawSection.split("-");
  return createSection(Number(begin), Number(end));
}

function initialize(file: string) {
  forEachLine(file, (line) => {
    const [first, second] = line.split(",");
    set((state) => {
      state.pairs.push([parseSection(first), parseSection(second)]);
    });
  });
}

const hasOverlap = ([first, second]: Pair) =>
  first.some((section) => second.includes(section));

const selectCountOfPairsWithFullContainment = (state: State) =>
  state.pairs.filter(hasOverlap).length;

export default function main() {
  initialize("public/4/input.txt");
  console.log(selectCountOfPairsWithFullContainment(get()));
}
