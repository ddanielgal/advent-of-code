import lodash from "lodash";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import forEachLine from "../modules/reader.js";

const alpha = Array.from(Array(26)).map((_, i) => i + 65);
const uppercase = alpha.map((x) => String.fromCharCode(x));
const lowercase = uppercase.map((x) => x.toLowerCase());
const items = [...lowercase, ...uppercase];

type Item = string;

function getPriority(item: Item) {
  return items.indexOf(item) + 1;
}

type State = {
  rucksacks: { leftCompartment: Item[]; rightCompartment: Item[] }[];
};

const useStore = create<State>()(
  immer(() => ({
    rucksacks: [],
  }))
);

const set = useStore.setState;

function initialize(file: string) {
  forEachLine(file, (line) => {
    const first = line.slice(0, line.length / 2);
    const second = line.slice(line.length / 2);
    set((state) => {
      state.rucksacks.push({
        leftCompartment: first.split(""),
        rightCompartment: second.split(""),
      });
    });
  });
}

const getCommonItems = (left: Item[], right: Item[]) => {
  return lodash.intersection(left, right);
};

const selectSumPrioritiesOfCommonItems = (state: State) => {
  const sackSums = state.rucksacks.map((sack) => {
    const commonItems = getCommonItems(
      sack.leftCompartment,
      sack.rightCompartment
    );
    return commonItems.reduce((acc, item) => acc + getPriority(item), 0);
  });
  return sackSums.reduce((acc, sum) => acc + sum, 0);
};

export default function main() {
  initialize("public/3/input.txt");
  console.log(selectSumPrioritiesOfCommonItems(useStore.getState()));
}
