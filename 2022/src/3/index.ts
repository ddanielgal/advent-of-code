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
  groups: Item[][][];
};

const useStore = create<State>()(
  immer(() => ({
    groups: [],
  }))
);

const set = useStore.setState;
const get = useStore.getState;

function initialize(file: string) {
  forEachLine(file, (line) => {
    if (
      get().groups.length === 0 ||
      get().groups[get().groups.length - 1].length === 3
    ) {
      set((state) => {
        state.groups.push([]);
      });
    }
    set((state) => {
      state.groups[state.groups.length - 1].push(line.split(""));
    });
  });
}

const selectSumPrioritiesOfCommonItems = (state: State) =>
  lodash.sum(
    state.groups.map((group) => {
      const commonItems = lodash.intersection(...group);
      return lodash.sum(commonItems.map(getPriority));
    })
  );

export default function main() {
  initialize("public/3/input.txt");
  console.log(selectSumPrioritiesOfCommonItems(get()));
}
