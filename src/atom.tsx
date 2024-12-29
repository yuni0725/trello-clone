import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface IToDo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

const { persistAtom } = recoilPersist();

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export const boardOrderState = atom<string[]>({
  key: "boardState",
  default: ["To Do", "Doing", "Done"],
  effects_UNSTABLE: [persistAtom],
});
