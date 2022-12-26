import create from "zustand";
import { immer } from "zustand/middleware/immer";
import forEachLine from "../modules/reader.js";

type State = {
  data: string | null;
};

const useStore = create<State>()(immer(() => ({ data: null })));

const set = useStore.setState;
const get = useStore.getState;

function initialize(file) {
  forEachLine(file, (line) => {
    set((state) => {
      state.data = line;
    });
  });
}

function selectStartOfPacketIndex(state: State) {
  for (let i = 14; i < state.data.length; i++) {
    const sequence = state.data.slice(i-14, i).split("");
    if (
      sequence.every((char) => sequence.filter((ch) => ch === char).length < 2)
    ) {
      return i;
    }
  }
  return null;
}

export default function main() {
  initialize("public/6/input.txt");
  console.log(selectStartOfPacketIndex(get()));
}
