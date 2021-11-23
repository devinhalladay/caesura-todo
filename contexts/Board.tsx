import React, { createContext, Dispatch, useContext } from "react";
import useOptimisticReducer from "use-optimistic-reducer";
import {
  Task,
  TaskAction,
  TaskIntent,
  TaskModalAction,
  TaskModalIntent,
} from "../types";
import { Optimistic } from "use-optimistic-reducer/build/types";
import { taskModalReducer, taskReducer } from "./reducers/task";

/**
 * This will be used to combine UI actions into a single type.
 * This is mainly to make it easier to maintain action types.
 */
export type AllActionType = {
  type: TaskAction | TaskModalAction;
  payload?: object;
  optimistic?: Optimistic<typeof taskReducer>;
};

export type InitialStateType = {
  tasks: Record<string, Record<Task["id"], Task>>;
  openTask: Task | null;
};

const initialState = {
  tasks: {} as Record<string, Record<Task["id"], Task>>,
  openTask: {} as Task,
};

/**
 * UI Context is used to store state for global UI elements.
 * We rely on React's useReducer() hook to access and update the state.
 * This pattern works in a similar way as Redux.
 *
 * If you want to add a value to the context provider (BoardProvider)
 * you should first define the types here.
 */
export const BoardContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<AllActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

/**
 * This pattern has the same rationale as AllActionType.
 * mainReducer() combines multiple reducers, each controlling
 * a specific piece of state. This keeps things a little cleaner
 * in the BoardProvider code.
 */
const mainReducer = (
  state: InitialStateType,
  action: TaskIntent | TaskModalIntent
) => ({
  ...state,
  ...taskReducer(state, action),
  ...taskModalReducer(state, action),
});

export const BoardProvider: React.FC = ({ children, value }) => {
  const initialState = value;
  const [state, dispatch] = useOptimisticReducer(mainReducer, initialState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

/** This is a hook you may use to access our context in a component. */
export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error(
      "useBoard can only be used in the context of a BoardProvider."
    );
  }
  return ctx;
};
