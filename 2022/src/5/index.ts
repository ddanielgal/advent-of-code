import lodash from "lodash";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import forEachLine from "../modules/reader.js";

type Crate = string;

type Stack = Crate[];

type Instruction = [number, number, number];

type Store = {
  stacks: Stack[];
  instructions: Instruction[];
};

const useStore = create<Store>()(
  immer(() => ({ stacks: [], instructions: [] }))
);

const set = useStore.setState;
const get = useStore.getState;

function createStack(index: number) {
  set((state) => {
    state.stacks[index] = [];
  });
}

function addCrate(crate: Crate, stack: number) {
  set((state) => {
    state.stacks[stack].push(crate);
  });
}

function moveCrate(from: number, to: number) {
  set((state) => {
    const crate = state.stacks[from].pop();
    state.stacks[to].push(crate);
  });
}

function moveCrates(from: number, to: number, count: number) {
  for (let i = 0; i < count; i++) moveCrate(from, to);
}

function initialize(file: string) {
  forEachLine(file, (line) => {
    if (line.includes("[")) {
      // Crates
      let row = line.slice();
      let stack = 0;
      while (row.length > 0) {
        const [_, crate, __, space, ...rest] = row;
        if (crate === " ") {
          // empty slot
          if (!get().stacks[stack]) createStack(stack);
          row = rest.join("");
          stack += 1;
          continue;
        }

        if (!get().stacks[stack]) createStack(stack);
        addCrate(crate, stack);

        if (!space) {
          // last item
          break;
        }

        row = rest.join("");
        stack += 1;
      }
    }
    if (line.includes("move")) {
      // Instruction
      const [_, count, __, from, ___, stack] = line.split(" ");
      set((state) => {
        state.instructions.push([Number(from)-1, Number(stack)-1, Number(count)]);
      });
    }
  });

  set((state) => {
    state.stacks.forEach((stack) => stack.reverse());
  });
}

function execute() {
  get().instructions.forEach(([from, to, count]) => {
    moveCrates(from, to, count);
  });
}

function selectTop(stack: number) {
  const crates = get().stacks[stack];
  return crates[crates.length - 1];
}

function selectTops() {
  return get().stacks.map((_, index) => selectTop(index));
}

export default function main() {
  initialize("public/5/input.txt");
  execute();
  console.log(selectTops().join(''));
}
